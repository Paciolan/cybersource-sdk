function check_latest_release() {
  strip_v='s/^v//i'

  repo="$1"
  version="$(echo "$2" | sed "$strip_v")"

  cmd="curl --silent 'https://api.github.com/repos/$repo/releases'"
  if [ -n "$GITHUB_TOKEN" ]; then
    cmd="$cmd --header 'Authorization: Bearer $GITHUB_TOKEN'"
  fi

  latest_version="$(
    eval $cmd \
    | jq --raw-output '. | sort_by(.tag_name) | .[-1].tag_name' \
    | sed "$strip_v"
  )"

  if [ "$version" != "$latest_version" ]; then
    >&2 echo -e "\033[1;33mThere is an update available for $repo: $version → $latest_version\033[0m"
  fi
}
