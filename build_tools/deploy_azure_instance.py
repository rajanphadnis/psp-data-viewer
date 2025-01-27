from azure.cli.core import get_default_cli
import os

appId = os.environ.get("AZURE_APP_ID")
password = os.environ.get("AZURE_PASSWORD_STRING")
tenant = os.environ.get("AZURE_TENANT_STRING")

print(appId)
print(password)
print(tenant)

# thing = get_default_cli().invoke(
#     [
#         "login",
#         "--service-principal",
#         "-u",
#         appId,
#         "-p",
#         password,
#         "--tenant",
#         tenant,
#     ]
# )
