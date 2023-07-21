#!/usr/bin/env bash

rm -rf output/

set -e

output_dir="output"
template_dir="template"
auth_dir="authentication"

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

# build the project
cd "$output_dir"
npm install
npm run build
