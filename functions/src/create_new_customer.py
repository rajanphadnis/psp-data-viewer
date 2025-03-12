import os
import subprocess
from firebase_functions import options, https_fn
import json
from azure.cli.core import get_default_cli
import stripe
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_admin import storage


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def createStripeAndFirebaseResources(req: https_fn.Request) -> https_fn.Response:
    body = req.get_json()
    slug = body["slug"] if "slug" in body else None
    name = body["name"] if "name" in body else None
    # country = body["country"] if "country" in body else "US"
    customerID = body["customerID"] if "customerID" in body else None
    email = body["email"] if "email" in body else None
    if slug is None:
        return https_fn.Response(
            json.dumps({"status": "'slug' is a required argument"}), status=400
        )
    if name is None:
        return https_fn.Response(
            json.dumps({"status": "'name' is a required argument"}), status=400
        )
    if customerID is None:
        return https_fn.Response(
            json.dumps({"status": "'customerID' is a required argument"}), status=400
        )
    if email is None:
        return https_fn.Response(
            json.dumps({"status": "'email' is a required argument"}), status=400
        )
    stripe.api_key = os.environ.get("STRIPE_TEST")
    subscription = stripe.Subscription.create(
        customer=customerID,
        collection_method="charge_automatically",
        items=[{"price": "price_1QvVZ7L6hziDD75ckYB4vBpB"}],
        payment_settings={"save_default_payment_method": "on_subscription"},
        automatic_tax={"enabled": True},
    )
    docToBuild = {
        "access_control": [email],
        "name": name,
        "slug": slug,
        "stripe_customer_id": customerID,
        "azure_share_name": f"dataviewer-fileshare-{slug}",
        "azure_storage_account": f"dataviewerstor{slug}",
        "azure_fxn_app_name": f"dataviewer-api-{slug}",
        "azure_rg": f"dataviewerrg{slug}",
    }
    db = firestore.client()
    customerDB = firestore.client(database_id=f"{slug}-firestore")
    update_time, city_ref = db.collection("accounts").add(docToBuild)
    db.collection("access_control").document("users").set(
        {f"{email}": firestore.ArrayUnion([f"{slug}:manage:permissions"])}, merge=True
    )
    customerDB.collection("general").document("tests").set(
        {
            "default": "sample",
            "visible": [
                {
                    "gse_article": "GSE",
                    "id": "sample",
                    "name": "Sample Test",
                    "starting_timestamp": 1708900564402,
                    "test_article": "VEHICLE",
                }
            ],
        }
    )
    customerDB.collection("general").document("articles").set(
        {
            "default_gse": "GSE",
            "default_test": "sample",
        }
    )
    customerDB.collection("sample").document("general").set(
        {
            "id": "sample",
            "name": "Sample Test",
            "gse_article": "GSE",
            "test_article": "VEHICLE",
            "azure_datasets": ["straight_line__raw__", "sensor_1__lbf__"],
            "starting_timestamp": 1708900564402,
            "ending_timestamp": 1708900564413,
        }
    )
    # Still need to create a new database and set the "general>tests>default" field to an emtpy string and the "general>tests>visible" field to an empty array
    return https_fn.Response(
        json.dumps(
            {
                "status": "Success",
                "result": {
                    "firestore_org_set": True,
                    "firestore_permissions_updated": True,
                    "customer": customerID,
                    "subscription": subscription.id,
                },
            }
        ),
        status=200,
    )


@https_fn.on_call(memory=options.MemoryOption.MB_512)
def update_azure_key(req: https_fn.CallableRequest):
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
        STORAGE_ACCT_NAME = acct_data["azure_storage_account"]
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
                    "storage",
                    "account",
                    "keys",
                    "list",
                    "--account-name",
                    STORAGE_ACCT_NAME,
                    "--resource-group",
                    RESOURCE_GROUP,
                ]
            )
        except Exception as e:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INTERNAL,
                message=(e),
            )
        if thing == 0:
            try:
                key = cli.result.result[0]["value"]
            except Exception as e:
                raise https_fn.HttpsError(
                    code=https_fn.FunctionsErrorCode.DATA_LOSS,
                    message=(e),
                )
            try:
                db.collection("api_access").document("acct_keys").update(
                    {f"{slug}": key}
                )
            except Exception as e:
                raise https_fn.HttpsError(
                    code=https_fn.FunctionsErrorCode.UNKNOWN,
                    message=(e),
                )
            return {"result": "complete"}
        else:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INTERNAL,
                message=(thing),
            )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.GB_2,
    timeout_sec=600,
)
def createNewDatabase(req: https_fn.Request) -> https_fn.Response:
    slug = req.args["slug"] if "slug" in req.args else None
    if slug is None:
        return https_fn.Response(
            json.dumps({"status": "'slug' is a required argument"}), status=400
        )
    dbID = f"{slug}-firestore"
    result1 = subprocess.Popen(
        'echo \'{"projects": {"default": "dataviewer-space"}}\' > .firebaserc',
        shell=True,
        stdout=subprocess.PIPE,
    ).stdout.read()
    result15 = subprocess.Popen(
        "echo 'rules_version = \"2\";service cloud.firestore {match /databases/{database}/documents {match /{document=**} {allow read;allow write: if false;}}}' > firestore.rules",
        shell=True,
        stdout=subprocess.PIPE,
    ).stdout.read()
    result2 = subprocess.Popen(
        f"curl -L https://firebase.tools/bin/linux/latest -o fb_tools && chmod +x ./fb_tools && ./fb_tools firestore:databases:create {dbID} --location=nam5 --token {os.environ['CLI_FIREBASE_TOKEN']}",
        shell=True,
        stdout=subprocess.PIPE,
    ).stdout.read()
    result3 = subprocess.Popen(
        f"./fb_tools hosting:sites:create dataviewer-{slug}",
        shell=True,
        stdout=subprocess.PIPE,
    ).stdout.read()
    print(result1)
    print(result15)
    print(result2)
    print(result3)
    print("done")
    return https_fn.Response(
        json.dumps(
            {
                "status": "Success",
                "result1": str(result1),
                "result2": str(result2),
                "result3": str(result3),
            }
        ),
        status=200,
    )
