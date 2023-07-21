#!/usr/bin/env bash

rm -rf output/

set -e

output_dir="output"
template_dir="template"
auth_dir="authentication"
tmp_dir="/tmp/com.cybersource.node-sdk"

# generate the library
java -jar swagger-codegen-cli-3.0.43.jar \
  generate \
  -i cybersource3.json \
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

# build the project
cd "$output_dir"
npm install
npm run build
