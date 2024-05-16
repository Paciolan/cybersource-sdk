failure() {
  local lineno=$1
  local msg=$2
  echo "Failed at $lineno: $msg"
  exit 1
}
trap 'failure ${LINENO} "$BASH_COMMAND"' ERR
