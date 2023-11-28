#!/usr/bin/env bash

rm -rf output/

set -e

# silence pushd & popd
pushd () {
  command pushd "$@" > /dev/null
}
popd () {
  command popd "$@" > /dev/null
}

function check_latest_release() {
  strip_v='s/^v//i'

  repo="$1"
  version="$(echo "$2" | sed "$strip_v")"

  latest_version="$(
    curl --silent "https://api.github.com/repos/$repo/releases" \
    | jq --raw-output '. | sort_by(.tag_name) | .[-1].tag_name' \
    | sed "$strip_v"
  )"

  if [ "$version" != "$latest_version" ]; then
    >&2 echo -e "\033[1;33mThere is an update available for $repo: $version → $latest_version\033[0m"
  fi
}

function fetch_swagger_codegen_bin() {
  check_latest_release "swagger-api/swagger-codegen" "$swagger_codegen_version"

  if [ ! -f "$swagger_codegen_bin_path" ]; then
    mkdir -p "$(dirname "$swagger_codegen_bin_path")"
    wget \
      --no-verbose \
      "https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/$swagger_codegen_version/swagger-codegen-cli-$swagger_codegen_version.jar" \
      --output-document="$swagger_codegen_bin_path"
  fi
}

# submodule the original swagger template and then patch our changes onto it
function update_submodule() {
  version_tag="$1"
  submodule_dir="$2"
  patch_path="$3"

  # clear any changes to submodule
  git -C "$submodule_dir" add .
  git -C "$submodule_dir" reset --hard

  # update submodule
  git submodule update --init "$submodule_dir"
  git -C "$submodule_dir" checkout "$version_tag"

  # apply patch
  git -C "$submodule_dir" apply --ignore-space-change --ignore-whitespace "$patch_path"

  # TODO: verify patch applied correctly
}

# submodule the original swagger template and then patch our changes onto it
function update_swagger_template() {
  check_latest_release "swagger-api/swagger-codegen-generators" "$swagger_codegen_templates_version"

  update_submodule \
    "$swagger_codegen_templates_version" \
    "$swagger_templates_dir" \
    "$swagger_template_patch" \
    ;
}

# submodule the "upstream" cybersource repo and then patch our changes onto it
function update_cybersource_upstream() {
  check_latest_release "CyberSource/cybersource-rest-client-node" "$cybersource_rest_client_version"

  update_submodule \
    "$cybersource_rest_client_version" \
    "$cybersource_rest_client_dir" \
    "$cybersource_rest_client_patch" \
    ;
}

function update_openapi_spec() {
  # copy official spec over if one does not already exist
  if [ ! -f "$cybersource_openapi_spec_path" ]; then
    mkdir -p "$(dirname "$cybersource_openapi_spec_path")"
    cp \
      "$cybersource_rest_client_dir/generator/cybersource-rest-spec.json" \
      "$cybersource_openapi_spec_path"
  fi

  # get current spec's OpenAPI version
  swagger_version=$(
    jq --raw-output '(.swagger, .openapi) | select (.!=null)' "$cybersource_openapi_spec_path"
  )
  swagger_version=(${swagger_version//\./ })

  # convert spec to v3 if it's not already
  if [ "${swagger_version[0]}" != "3" ]; then
    # convert spec to OpenAPI 3
    curl \
      --silent \
      --location 'https://converter.swagger.io/api/convert' \
      --header 'Content-Type: application/json' \
      --data @"$cybersource_rest_client_dir/generator/cybersource-rest-spec.json" \
      --output "$cybersource_openapi_spec_path"
  fi
}

function generate() {
  # generate the library
  java -jar "$swagger_codegen_bin_path" \
    generate \
    -i "$cybersource_openapi_spec_path" \
    --lang typescript-axios \
    --template-dir "$swagger_template_ts_axios_dir/" \
    --config "$root_dir/config.json" \
    --output "$output_dir/"

  # ensure we generated correctly (swagger-codegen always exits with 0)
  if [ ! -d "$output_dir" ]; then
    exit 1
  fi

  # copy auth files into generated output
  cp -r "$src_dir/" "$output_dir/"

  # update package.json
  tmp_packagejson="$tmp_dir/package.json"
  mkdir -p "$(dirname "$tmp_packagejson")"
  jq -s '.[0] * .[1]' "$output_dir/package.json" "$root_dir/package.json" > "$tmp_packagejson"
  mv "$tmp_packagejson" "$output_dir/package.json"
}

function build() {
  # build the project
  cd "$output_dir"
  npm install
  npm run build
}

# TODO: submodule the OG auth files and then patch our changes onto it

root_dir="$(realpath .)"
output_dir="$root_dir/output"
template_dir="$root_dir/template"
src_dir="$root_dir/src"
tmp_dir="/tmp/com.cybersource.node-sdk"
git_modules_dir="$root_dir/modules"

swagger_codegen_version="3.0.43"
swagger_codegen_bin_path="$root_dir/bin/swagger-codegen-cli-$swagger_codegen_version.jar"

cybersource_rest_client_node_version="0.0.51"
cybersource_rest_client_node_path="$root_dir/tmp/cybersource-rest-client-node-$cybersource_rest_client_node_version"
cybersource_openapi_spec_path="$root_dir/tmp/cybersource-openapi3.json"

cybersource_rest_client_version="0.0.51"
cybersource_rest_client_dir="$git_modules_dir/cybersource-rest-client-node"
cybersource_rest_client_patch="$src_dir/custom-code.patch"

swagger_codegen_templates_version="v1.0.44"
swagger_templates_dir="$git_modules_dir/templates"
swagger_template_ts_axios_dir="$swagger_templates_dir/src/main/resources/handlebars/typescript-axios"
swagger_template_patch="$template_dir/template.patch"

fetch_swagger_codegen_bin
update_swagger_template
update_cybersource_upstream
update_openapi_spec
generate
build
