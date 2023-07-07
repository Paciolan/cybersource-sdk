#!/usr/bin/env bash

rm -rf output/

set -e

java -jar swagger-codegen-cli-3.0.43.jar \
  generate \
  -i cybersource3.json \
  --lang typescript-axios \
  --config config.json \
  --output output/

cd output
npm install
npm run build
