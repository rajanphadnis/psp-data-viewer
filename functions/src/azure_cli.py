import os
from firebase_functions import options, https_fn
import json
from azure.cli.core import get_default_cli


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def updateAPIInstances(req: https_fn.Request) -> https_fn.Response:
    # Comments
    instances = req.args["instances"] if "instances" in req.args else None
    if instances is None:
        return https_fn.Response(
            json.dumps({"status": "'instances' is required"}), status=400
        )
    try:
        numToSet = int(float(instances))
    except ValueError:
        return https_fn.Response(
            json.dumps({"status": "Could not parse int from argument 'instances'"}),
            status=400,
        )

    appId = os.environ.get("AZURE_APP_ID")
    password = os.environ.get("AZURE_PASSWORD_STRING")
    tenant = os.environ.get("AZURE_TENANT_STRING")

    print(appId)
    print(password)
    print(tenant)

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
        # thing = get_default_cli().invoke(["webapp", "config", "storage-account", "list", "--resource-group", "pspdataviewer", "--name", "psp-data-viewer-api"])
        thing = get_default_cli().invoke(
            [
                "functionapp",
                "scale",
                "config",
                "always-ready",
                "set",
                "--resource-group",
                "pspdataviewer",
                "--name",
                "psp-data-viewer-api",
                "--settings",
                f"http={numToSet}",
            ]
        )

    except Exception as e:
        return https_fn.Response(json.dumps({"status": f"error: {e}"}), status=500)
    if thing == 0:
        return https_fn.Response(json.dumps({"status": "Success"}), status=200)
    else:
        return https_fn.Response(
            json.dumps({"status": f"Failed, exit code: {thing}"}), status=500
        )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def getAPIConfig(req: https_fn.Request) -> https_fn.Response:
    appId = os.environ.get("AZURE_APP_ID")
    password = os.environ.get("AZURE_PASSWORD_STRING")
    tenant = os.environ.get("AZURE_TENANT_STRING")

    print(appId)
    print(password)
    print(tenant)

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
        thing = cli.invoke(
            [
                "functionapp",
                "scale",
                "config",
                "show",
                "--resource-group",
                "pspdataviewer",
                "--name",
                "psp-data-viewer-api",
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