#!/usr/bin/env bash

rm -rf output/

set -e

source "$(dirname "$0")/lib/variables.sh"
source "$(dirname "$0")/lib/check-latest-release.sh"
source "$(dirname "$0")/lib/submodule.sh"

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
function update_swagger_template() {
  check_latest_release "swagger-api/swagger-codegen-generators" "$swagger_codegen_templates_version"

  update_submodule_and_apply_patch \
    "$swagger_codegen_templates_version" \
    "$swagger_templates_dir" \
    "$swagger_template_patch" \
    ;
}

# submodule the "upstream" cybersource repo and then patch our changes onto it
function update_cybersource_upstream() {
  check_latest_release "CyberSource/cybersource-rest-client-node" "$cybersource_rest_client_version"

  update_submodule_and_apply_patch \
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

fetch_swagger_codegen_bin
update_swagger_template
update_cybersource_upstream
update_openapi_spec
generate
build
