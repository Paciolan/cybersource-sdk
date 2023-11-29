function check_latest_release() {
  strip_v='s/^v//i'

  repo="$1"
  version="$(echo "$2" | sed "$strip_v")"

  latest_version="$(
    curl --silent "https://api.github.com/repos/$repo/releases" \
    | jq --raw-output '. | sort_by(.tag_name) | .[-1].tag_name' \
    | sed "$strip_v"
  )"

  if [ "$version" != "$latest_version" ]; then
    >&2 echo -e "\033[1;33mThere is an update available for $repo: $version → $latest_version\033[0m"
  fi
}
