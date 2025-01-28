import os
from firebase_functions import options, https_fn
import json
from azure.cli.core import get_default_cli
import stripe
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter


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
    country = body["country"] if "country" in body else "US"
    zipCode = body["zipCode"] if "zipCode" in body else None
    email = body["email"] if "email" in body else None
    if slug is None:
        return https_fn.Response(
            json.dumps({"status": "'slug' is a required argument"}), status=400
        )
    if name is None:
        return https_fn.Response(
            json.dumps({"status": "'name' is a required argument"}), status=400
        )
    if zipCode is None:
        return https_fn.Response(
            json.dumps({"status": "'zipCode' is a required argument"}), status=400
        )
    if email is None:
        return https_fn.Response(
            json.dumps({"status": "'email' is a required argument"}), status=400
        )
    stripe.api_key = os.environ.get("STRIPE_TEST")
    customer = stripe.Customer.create(
        name=name,
        email=email,
        tax={"validate_location": "immediately"},
        address={
            "country": country,
            "postal_code": zipCode,
        },
        shipping={
            "address": {"country": country, "postal_code": zipCode},
            "name": name,
        },
        metadata={"slug": slug},
    )
    subscription = stripe.Subscription.create(
        customer=customer.id,
        collection_method="charge_automatically",
        items=[{"price": "price_1QljEnL6hziDD75cG8eOInvb"}],
        payment_settings={"save_default_payment_method": "on_subscription"},
        automatic_tax={"enabled": True},
    )
    docToBuild = {
        "access_control": [email],
        "name": name,
        "slug": slug,
        "stripe_customer_id": customer.id,
        "azure_share_name": f"dataviewer-fileshare-{slug}",
        "azure_storage_account": f"dataviewerstorage{slug}",
    }
    db = firestore.client()
    update_time, city_ref = db.collection("accounts").add(docToBuild)
    db.collection("access_control").document("users").set(
        {f"{email}": firestore.ArrayUnion([f"{slug}:manage:permissions"])}, merge=True
    )
    # Still need to create a new database and set the "general>tests>default" field to an emtpy string and the "general>tests>visible" field to an empty array
    return https_fn.Response(
        json.dumps(
            {
                "status": "Success",
                "result": {
                    "firestore_org_set": True,
                    "firestore_permissions_updated": True,
                    "customer": customer.id,
                    "subscription": subscription.id,
                },
            }
        ),
        status=200,
    )


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
    timeout_sec=600,
)
def createAzureResources(req: https_fn.Request) -> https_fn.Response:
    slug = req.args["slug"] if "slug" in req.args else None
    stripeKey = os.environ.get("STRIPE_TEST")

    if slug is None:
        return https_fn.Response(
            json.dumps({"status": "'slug' is a required argument"}), status=400
        )
    if stripeKey is None:
        return https_fn.Response(
            json.dumps({"status": "Stripe API key not set"}), status=400
        )

    db = firestore.client()
    firestore_query = db.collection("accounts").where(
        filter=FieldFilter("slug", "==", slug)
    )
    docs = firestore_query.stream()
    for doc in docs:
        customerID = doc.to_dict()["stripe_customer_id"]

    if customerID is None:
        return https_fn.Response(
            json.dumps({"status": "'stripe_customer_id' not set"}), status=400
        )

    location = "eastus"
    resourceGroup = f"dataviewer-rg-{slug}"
    functionApp = f"dataviewer-serverless-function-{slug}"
    skuStorage = "Standard_LRS"
    pythonVersion = "3.11"
    directory = "hdf5_data"
    share = f"dataviewer-fileshare-{slug}"
    shareId = f"dataviewer-share-{slug}"
    mountPath = "/hdf5data"
    AZURE_STORAGE_ACCOUNT = f"dataviewerstorage{slug}"

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
        thing = cli.invoke(
            ["group", "create", "--name", resourceGroup, "--location", location]
        )
        thing = cli.invoke(
            [
                "storage",
                "account",
                "create",
                "--name",
                AZURE_STORAGE_ACCOUNT,
                "--location",
                location,
                "--resource-group",
                resourceGroup,
                "--sku",
                skuStorage,
            ]
        )
        cli.invoke(
            [
                "storage",
                "account",
                "keys",
                "list",
                "-g",
                resourceGroup,
                "-n",
                AZURE_STORAGE_ACCOUNT,
                "--query",
                "[0].value",
                "-o",
                "tsv",
            ]
        )
        AZURE_STORAGE_KEY = cli.result.result
        print(AZURE_STORAGE_KEY)
        thing = cli.invoke(
            [
                "functionapp",
                "create",
                "--name",
                functionApp,
                "--storage-account",
                AZURE_STORAGE_ACCOUNT,
                "--flexconsumption-location",
                location,
                "--resource-group",
                resourceGroup,
                "--runtime",
                "python",
                "--runtime-version",
                pythonVersion,
                "--instance-memory",
                "2048",
            ]
        )
        thing = cli.invoke(
            [
                "storage",
                "share",
                "create",
                "--name",
                share,
                "--account-name",
                AZURE_STORAGE_ACCOUNT,
            ]
        )
        thing = cli.invoke(
            [
                "storage",
                "directory",
                "create",
                "--share-name",
                share,
                "--name",
                directory,
                "--account-name",
                AZURE_STORAGE_ACCOUNT,
            ]
        )
        thing = cli.invoke(
            [
                "webapp",
                "config",
                "storage-account",
                "add",
                "--resource-group",
                resourceGroup,
                "--name",
                functionApp,
                "--custom-id",
                shareId,
                "--storage-type",
                "AzureFiles",
                "--share-name",
                share,
                "--account-name",
                AZURE_STORAGE_ACCOUNT,
                "--mount-path",
                mountPath,
                "--access-key",
                AZURE_STORAGE_KEY,
            ]
        )
        thing = cli.invoke(
            [
                "functionapp",
                "config",
                "appsettings",
                "set",
                "--name",
                functionApp,
                "--resource-group",
                resourceGroup,
                "--settings",
                f"STRIPE_API_KEY={stripeKey}",
                f"STRIPE_CUSTOMER_ID={customerID}",
            ]
        )
        thing = cli.invoke(
            [
                "functionapp",
                "cors",
                "add",
                "-g",
                resourceGroup,
                "-n",
                functionApp,
                "--allowed-origins",
                "*",
            ]
        )

    except Exception as e:
        return https_fn.Response(json.dumps({"status": f"error: {e}"}), status=500)
    if thing == 0:
        return https_fn.Response(
            json.dumps(
                {
                    "status": "Success",
                    "result": {"raw": cli.result.result, "acct": AZURE_STORAGE_KEY},
                }
            ),
            status=200,
        )
    else:
        return https_fn.Response(
            json.dumps({"status": "Failed with exit code", "result": cli.result.error}),
            status=500,
        )
