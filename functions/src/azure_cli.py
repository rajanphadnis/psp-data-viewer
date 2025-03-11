import os
from firebase_functions import options, https_fn
import json
from azure.cli.core import get_default_cli
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter


# class optionsThing:
#     cors_origins = [
#         # "https://admin.dataviewer.space"
#         "*"
#     ]


@https_fn.on_call(memory=options.MemoryOption.MB_512)
def update_api_instance_count(req: https_fn.CallableRequest):
    perms = req.auth.token["permissions"]
    slug = req.data["slug"]
    instances = int(float(req.data["instances"]))

    if f"{slug}:manage:instance" in perms:
        db = firestore.client()
        accts = (
            db.collection("accounts")
            .where(filter=FieldFilter("slug", "==", slug))
            .limit(1)
            .stream()
        )

        for acct in accts:
            acct_data = acct.to_dict()
            RESOURCE_GROUP = acct_data["azure_rg"]
            FXN_APP_NAME = acct_data["azure_fxn_app_name"]
            appId = os.environ.get("AZURE_APP_ID")
            password = os.environ.get("AZURE_PASSWORD_STRING")
            tenant = os.environ.get("AZURE_TENANT_STRING")
            try:
                thing = get_default_cli().invoke(
                    [
                        "login",
                        "--service-principal",
                        "-u",
                        appId,
                        "-p",
                        password,
                        "--tenant",
                        tenant,
                    ]
                )
                thing = get_default_cli().invoke(
                    [
                        "functionapp",
                        "scale",
                        "config",
                        "always-ready",
                        "set",
                        "--resource-group",
                        RESOURCE_GROUP,
                        "--name",
                        FXN_APP_NAME,
                        "--settings",
                        f"http={instances}",
                    ]
                )

            except Exception as e:
                raise https_fn.HttpsError(
                    code=https_fn.FunctionsErrorCode.INTERNAL,
                    message=(e),
                )
            if thing == 0:
                return {"status": "Success"}
            else:
                raise https_fn.HttpsError(
                    code=https_fn.FunctionsErrorCode.INTERNAL,
                    message=(thing),
                )

    else:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            message=("User does not have permission to update API instance count"),
        )


@https_fn.on_call(memory=options.MemoryOption.MB_512)
def get_api_instance_count(req: https_fn.CallableRequest):
    slug = req.data["slug"]

    db = firestore.client()
    accts = (
        db.collection("accounts")
        .where(filter=FieldFilter("slug", "==", slug))
        .limit(1)
        .stream()
    )
    for acct in accts:
        acct_data = acct.to_dict()
        RESOURCE_GROUP = acct_data["azure_rg"]
        FXN_APP_NAME = acct_data["azure_fxn_app_name"]

        appId = os.environ.get("AZURE_APP_ID")
        password = os.environ.get("AZURE_PASSWORD_STRING")
        tenant = os.environ.get("AZURE_TENANT_STRING")

        try:
            cli = get_default_cli()
            thing = cli.invoke(
                [
                    "login",
                    "--service-principal",
                    "-u",
                    appId,
                    "-p",
                    password,
                    "--tenant",
                    tenant,
                ]
            )
            thing = cli.invoke(
                [
                    "functionapp",
                    "scale",
                    "config",
                    "show",
                    "--resource-group",
                    RESOURCE_GROUP,
                    "--name",
                    FXN_APP_NAME,
                ]
            )

        except Exception as e:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INTERNAL,
                message=(e),
            )
        if thing == 0:
            return {"result": cli.result.result}
        else:
            print(thing)
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INTERNAL,
                message=(cli.result.error),
            )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def getStorageUsage(req: https_fn.Request) -> https_fn.Response:
    name = req.args["name"] if "name" in req.args else None
    acct = req.args["acct"] if "acct" in req.args else None

    if name is None:
        return https_fn.Response(
            json.dumps({"status": "'name' is required"}), status=400
        )
    if acct is None:
        return https_fn.Response(
            json.dumps({"status": "'acct' is required"}), status=400
        )

    appId = os.environ.get("AZURE_APP_ID")
    password = os.environ.get("AZURE_PASSWORD_STRING")
    tenant = os.environ.get("AZURE_TENANT_STRING")

    print(appId)
    print(password)
    print(tenant)
    print(name)
    print(acct)

    try:
        cli = get_default_cli()
        thing = cli.invoke(
            [
                "login",
                "--service-principal",
                "-u",
                appId,
                "-p",
                password,
                "--tenant",
                tenant,
            ]
        )
        # thing = get_default_cli().invoke(["webapp", "config", "storage-account", "list", "--resource-group", "pspdataviewer", "--name", "psp-data-viewer-api"])
        # az storage share stats --name dataviewer-fileshare-pspl --account-name dataviewerstoragepspl
        thing = cli.invoke(
            [
                "storage",
                "share",
                "stats",
                "--name",
                name,
                "--account-name",
                acct,
            ]
        )

    except Exception as e:
        return https_fn.Response(json.dumps({"status": f"error: {e}"}), status=500)
    if thing == 0:
        return https_fn.Response(
            json.dumps({"status": "Success", "result": cli.result.result}), status=200
        )
    else:
        return https_fn.Response(
            json.dumps(
                {"status": f"Failed, exit code: {thing}", "result": cli.result.error}
            ),
            status=500,
        )


# https://getstorageusage-apichvaima-uc.a.run.app/?name=dataviewer-fileshare-pspl&acct=dataviewerstoragepspl
# https://getstorageusage-apichvaima-uc.a.run.app/?name=psp-data-viewer3d1877&acct=pspdataviewer
