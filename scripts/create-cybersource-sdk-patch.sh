#!/usr/bin/env bash
set -e

source "$(dirname "$0")/lib/variables.sh"
source "$(dirname "$0")/lib/check-latest-release.sh"
source "$(dirname "$0")/lib/submodule.sh"

function main() {

  update_submodule \
    "$cybersource_rest_client_version" \
    "$cybersource_rest_client_dir" \
    ;

  cp -R "$src_dir/" "$cybersource_rest_client_dir/src/"
  rm -f "$cybersource_rest_client_dir/src/"*.patch

  # create patch
  git -C "$cybersource_rest_client_dir" add .
  git -C "$cybersource_rest_client_dir" diff HEAD > "$cybersource_rest_client_patch"
}

main
