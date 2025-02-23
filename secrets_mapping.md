Formatting: [local secret name]:[dotenv secret name]

./admin_v2/.env.dev

- APP_CHECK_KEY:APP_CHECK_KEY

./admin_v2/.env.prod.publish

- APP_CHECK_KEY:APP_CHECK_KEY

./build_tools/.env

- AZURE_APP_ID:AZURE_APP_ID
- AZURE_PASSWORD_STRING:AZURE_PASSWORD_STRING
- AZURE_TENANT_STRING:AZURE_TENANT_STRING
- GOOGLE_APPLICATION_CREDENTIALS:[path to adc json. json under key: GOOGLE_APPLICATION_DEFAULT_CREDENTIALS in dotenv]

./build_tools/application_default_credentials.json
./build_tools/GoogleCloudSA_GitHubAccess.json [json under key: GOOGLECLOUDSA_GITHUBACCESS]

./functions/.env

- STRIPE_TEST:STRIPE_SECRET_KEY
- AZURE_APP_ID:AZURE_APP_ID
- AZURE_PASSWORD_STRING:AZURE_PASSWORD_STRING
- AZURE_TENANT_STRING:AZURE_TENANT_STRING
- CLI_FIREBASE_TOKEN:CLI_FIREBASE_TOKEN_CREATE_DATABASE

./functions/application_default_credentials.json

./mission/.env.dev

- APP_CHECK_KEY:APP_CHECK_KEY

./mission/.env.prod.publish

- APP_CHECK_KEY:APP_CHECK_KEY

./webapp_v2/.env.dev

- APP_CHECK_KEY:APP_CHECK_KEY

./webapp_v2/.env.prod.publish

- APP_CHECK_KEY:APP_CHECK_KEY

./website/.env.dev

- APP_CHECK_KEY:APP_CHECK_KEY
- STRIPE_PK:STRIPE_PUBLISHABLE_KEY
- GITHUB_WORKFLOW_KEY:GITHUB_INIT_WORKFLOW_KEY_WEBSITE

./website/.env.prod.publish

- APP_CHECK_KEY:APP_CHECK_KEY
- STRIPE_PK:STRIPE_PUBLISHABLE_KEY
- GITHUB_WORKFLOW_KEY:GITHUB_INIT_WORKFLOW_KEY_WEBSITE
