function update_submodule() {
  version_tag="$1"
  submodule_dir="$2"

  # clear any changes to submodule
  git -C "$submodule_dir" add .
  git -C "$submodule_dir" reset --hard > /dev/null

  # # update submodule
  git submodule update --init "$submodule_dir" > /dev/null
  git -C "$submodule_dir" checkout "$version_tag" 2> /dev/null
}

function apply_patch() {
  submodule_dir="$1"
  patch_path="$2"

  git -C "$submodule_dir" \
    apply --ignore-space-change \
      --ignore-whitespace "$patch_path"

  # TODO: verify patch applied correctly
}

function update_submodule_and_apply_patch() {
  version_tag="$1"
  submodule_dir="$2"
  patch_path="$3"

  update_submodule "$version_tag" "$submodule_dir"
  apply_patch "$submodule_dir" "$patch_path"
}
