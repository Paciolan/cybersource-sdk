#!/usr/bin/env bash

rm -rf output/

set -e

function fetch_swagger_codegen_bin() {
  latest_swagger_codegen_version="$(
    curl --silent "https://api.github.com/repos/swagger-api/swagger-codegen/releases/latest" \
    | jq --raw-output '.tag_name'
  )"

  if [ "v$swagger_codegen_version" != "$latest_swagger_codegen_version" ]; then
    >&2 echo -e "\033[1;33mThere is an update available for Swagger Codegen: $latest_swagger_codegen_version\033[0m"
  fi

  if [ ! -f "$swagger_codegen_bin_path" ]; then
    mkdir -p "$(dirname "$swagger_codegen_bin_path")"
    wget \
      --no-verbose \
      "https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/$swagger_codegen_version/swagger-codegen-cli-$swagger_codegen_version.jar" \
      --output-document="$swagger_codegen_bin_path"
  fi
}

function fetch_official_cybersource_sdk() {
  latest_release="$(
    curl --silent "https://api.github.com/repos/CyberSource/cybersource-rest-client-node/releases?per_page=1" \
    | jq --raw-output '.[0].tag_name'
  )"

  if [ "$cybersource_rest_client_node_version" != "$latest_release" ]; then
    echo "$cybersource_rest_client_node_version" != "$latest_release"
    >&2 echo -e "\033[1;33mThere is an update available for cybersource-rest-client-node: $cybersource_rest_client_node_version\033[0m"
  fi

  # download the repo
  if [ ! -f "$cybersource_rest_client_node_path.tar" ]; then
    tarball_url="$(
      curl --silent "https://api.github.com/repos/CyberSource/cybersource-rest-client-node/releases/tags/$cybersource_rest_client_node_version" \
      | jq --raw-output '.tarball_url'
    )"
    mkdir -p "$(dirname "$cybersource_rest_client_node_path")"
    wget \
      --no-verbose \
      "$tarball_url" \
      --output-document="$cybersource_rest_client_node_path.tar"
  fi
  # untar the repo
  if [ ! -f "$cybersource_rest_client_node_path" ]; then
    mkdir -p "$cybersource_rest_client_node_path"
    tar \
      --extract \
      --strip-components=1 \
      --file="$cybersource_rest_client_node_path.tar" \
      --directory="$cybersource_rest_client_node_path"
  fi
}

function update_openapi_spec() {
  # copy official spec over if one does not already exist
  if [ ! -f "$cybersource_openapi_spec_path" ]; then
    cp \
      "$cybersource_rest_client_node_path/generator/cybersource-rest-spec.json" \
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
      --data @"$cybersource_rest_client_node_path/generator/cybersource-rest-spec.json" \
      --output "$cybersource_openapi_spec_path"
  fi
}

function generate() {
  # generate the library
  java -jar "$swagger_codegen_bin_path" \
    generate \
    -i "$cybersource_openapi_spec_path" \
    --lang typescript-axios \
    --template-dir "$template_dir/" \
    --config config.json \
    --output "$output_dir/"

  # ensure we generated correctly (swagger-codegen always exits with 0)
  if [ ! -d "$output_dir" ]; then
    exit 1
  fi

  # copy auth files into generated output
  cp -r "$auth_dir/" "$output_dir/$auth_dir/"

  # update package.json
  tmp_packagejson="$tmp_dir/package.json"
  mkdir -p "$(dirname "$tmp_packagejson")"
  jq -s '.[0] * .[1]' "$output_dir/package.json" "./package.json" > "$tmp_packagejson"
  mv "$tmp_packagejson" "$output_dir/package.json"
}

function build() {
  # build the project
  cd "$output_dir"
  npm install
  npm run build
}

# TODO: submodule the OG template and then patch our changes onto it
# TODO: submodule the OG auth files and then patch our changes onto it

output_dir="output"
template_dir="template"
auth_dir="authentication"
tmp_dir="/tmp/com.cybersource.node-sdk"

swagger_codegen_version="3.0.43"
swagger_codegen_bin_path="bin/swagger-codegen-cli-$swagger_codegen_version.jar"

cybersource_rest_client_node_version="0.0.48"
cybersource_rest_client_node_path="tmp/cybersource-rest-client-node-$cybersource_rest_client_node_version"
cybersource_openapi_spec_path="tmp/cybersource-openapi3.json"

fetch_swagger_codegen_bin
fetch_official_cybersource_sdk
update_openapi_spec
generate
build
