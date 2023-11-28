#!/usr/bin/env bash
set -e

source "$(dirname "$0")/lib/variables.sh"
source "$(dirname "$0")/lib/check-latest-release.sh"
source "$(dirname "$0")/lib/submodule.sh"

function main() {
  check_latest_release "swagger-api/swagger-codegen-generators" "$swagger_codegen_templates_version"

  update_submodule \
    "$swagger_codegen_templates_version" \
    "$swagger_templates_dir" \
    ;

  cp -R "$template_dir"/* "$swagger_template_ts_axios_dir/"
  rm "$swagger_template_ts_axios_dir/"*.patch

  # create patch
  git -C "$swagger_templates_dir" diff HEAD > "$swagger_template_patch"
}

main
