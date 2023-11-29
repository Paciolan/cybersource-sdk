#!/usr/bin/env bash
set -e

root=$(dirname "$0")

"$root/create-cybersource-sdk-patch.sh"
"$root/create-template-patch.sh"

"$root/generate.sh"
