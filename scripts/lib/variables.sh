root_dir="$(realpath .)"
output_dir="$root_dir/output"
template_dir="$root_dir/template"
src_dir="$root_dir/src"
tmp_dir="/tmp/com.cybersource.node-sdk"
git_modules_dir="$root_dir/modules"

cybersource_rest_client_version="0.0.56"
cybersource_rest_client_dir="$git_modules_dir/cybersource-rest-client-node"
cybersource_rest_client_patch="$src_dir/custom-code.patch"

cybersource_openapi_spec_path="$root_dir/tmp/cybersource-openapi3.json"

swagger_codegen_version="3.0.43"
swagger_codegen_bin_path="$root_dir/bin/swagger-codegen-cli-$swagger_codegen_version.jar"

swagger_codegen_templates_version="v1.0.44"
swagger_templates_dir="$git_modules_dir/templates"
swagger_template_ts_axios_dir="$swagger_templates_dir/src/main/resources/handlebars/typescript-axios"
swagger_template_patch="$template_dir/template.patch"
