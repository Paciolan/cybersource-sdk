#!/usr/bin/env bash
set -e

root=$(dirname "$0")

source "$(dirname "$0")/lib/error-handler.sh"

"$root/create-cybersource-sdk-patch.sh"
"$root/create-template-patch.sh"

"$root/generate.sh"
