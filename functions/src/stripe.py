import json
from firebase_functions import https_fn, options
from firebase_admin import firestore
import os
import stripe
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime, timezone
from azure.cli.core import get_default_cli


class optionsThing:
    cors_origins = ["https://admin.dataviewer.space"]


@https_fn.on_call(cors=optionsThing)
def fetchMeterUsage(req: https_fn.CallableRequest) -> any:
    db = firestore.client()
    email = req.auth.token.get("email", "")
    docsStream = (
        db.collection("accounts")
        .where(filter=FieldFilter("access_control", "array_contains", email))
        .stream()
    )
    cusIDs = []
    for doc in docsStream:
        cusIDs.append(doc.to_dict()["stripe_customer_id"])
    print(f"getting customer portal for {email}")
    currentTime = int(datetime.now(timezone.utc).timestamp())
    bottomOfHour = int(int(currentTime) / 3600) * 3600
    print(bottomOfHour)
    print(cusIDs[0])
    stripe.api_key = os.environ.get("STRIPE_TEST")
    sess = stripe.billing.Meter.list_event_summaries(
        "mtr_test_61RgwcswWwXnOi3ro41L6hziDD75cKcS",
        customer=cusIDs[0],
        start_time=bottomOfHour - 604800,
        end_time=bottomOfHour,
        value_grouping_window="hour",
        limit=168,
    )
    print(sess)
    return {"meter": sess}


@https_fn.on_call(cors=optionsThing)
def fetchNextInvoice(req: https_fn.CallableRequest) -> any:
    db = firestore.client()
    email = req.auth.token.get("email", "")
    docsStream = (
        db.collection("accounts")
        .where(filter=FieldFilter("access_control", "array_contains", email))
        .stream()
    )
    cusIDs = []
    for doc in docsStream:
        cusIDs.append(doc.to_dict()["stripe_customer_id"])
    print(f"getting customer portal for {email}")
    currentTime = int(datetime.now(timezone.utc).timestamp())
    bottomOfHour = int(int(currentTime) / 3600) * 3600
    print(bottomOfHour)
    print(cusIDs[0])
    stripe.api_key = os.environ.get("STRIPE_TEST")
    invoice = stripe.Invoice.upcoming(customer=cusIDs[0])
    return {"invoice": invoice}


@https_fn.on_call(cors=optionsThing)
def fetchStripePortalLink(req: https_fn.CallableRequest) -> any:
    db = firestore.client()
    return_url = req.data["return_url"]
    email = req.auth.token.get("email", "")
    docsStream = (
        db.collection("accounts")
        .where(filter=FieldFilter("access_control", "array_contains", email))
        .stream()
    )
    cusIDs = []
    for doc in docsStream:
        cusIDs.append(doc.to_dict()["stripe_customer_id"])
    print(f"getting customer portal for ${email}")
    stripe.api_key = os.environ.get("STRIPE_TEST")
    sess = stripe.billing_portal.Session.create(
        customer=cusIDs[0],
        return_url=return_url,
    )
    return {"url": sess.url}


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def addAzureStoragePricing(req: https_fn.Request) -> https_fn.Response:
    body = req.get_json()
    invoice = body["data"]["object"]["id"]
    customer = body["data"]["object"]["customer"]
    subscription = body["data"]["object"]["subscription"]
    https_fn.Response(
        json.dumps({"status": "Success", "result": "processing"}), status=200
    )

    print(body["data"]["object"]["id"])

    db = firestore.client()
    firestore_query = db.collection("accounts").where(
        filter=FieldFilter("stripe_customer_id", "==", customer)
    )
    docs = firestore_query.stream()
    for doc in docs:
        share_name = doc.to_dict()["azure_share_name"]
        storage_acct = doc.to_dict()["azure_storage_account"]

    appId = os.environ.get("AZURE_APP_ID")
    password = os.environ.get("AZURE_PASSWORD_STRING")
    tenant = os.environ.get("AZURE_TENANT_STRING")

    print(appId)
    print(password)
    print(tenant)
    print(share_name)
    print(storage_acct)

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
                "share",
                "stats",
                "--name",
                share_name,
                "--account-name",
                storage_acct,
            ]
        )

    except Exception as e:
        return https_fn.Response(json.dumps({"status": f"error: {e}"}), status=500)

    stripe.api_key = os.environ.get("STRIPE_TEST")
    newinvoiceItem = stripe.InvoiceItem.create(
        customer=customer,
        price="price_1QljY3L6hziDD75cJGxsW8Nm",
        invoice=invoice,
        quantity=15,
        subscription=subscription,
    )
    finalize = stripe.Invoice.finalize_invoice(invoice)
    print(newinvoiceItem)
    print(finalize)
    print("created & finalized stripe invoice")

    if thing == 0:
        return https_fn.Response(
            json.dumps({"status": "Success", "result": int(cli.result.result)}),
            status=200,
        )
    else:
        return https_fn.Response(
            json.dumps(
                {"status": f"Failed, exit code: {thing}", "result": cli.result.error}
            ),
            status=500,
        )


@https_fn.on_call(
    # cors=options.CorsOptions(
    #     cors_origins="*",
    #     cors_methods=["get", "post"],
    # ),
    # memory=options.MemoryOption.MB_512,
)
def createCustomerIntentAndCustomerSession(req: https_fn.CallableRequest) -> any:
    body = req.data
    slug = body["slug"] if "slug" in body else None
    name = body["name"] if "name" in body else None
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
            "country": "US",
            "postal_code": zipCode,
        },
        shipping={
            "address": {"country": "US", "postal_code": zipCode},
            "name": name,
        },
        metadata={"slug": slug},
    )
    intent = stripe.SetupIntent.create(
        # In the latest version of the API, specifying the `automatic_payment_methods` parameter
        # is optional because Stripe enables its functionality by default.
        automatic_payment_methods={
            "enabled": True,
        },
        customer=customer.id,
    )
    return {"client_secret": intent.client_secret, "customer_id": customer.id}
