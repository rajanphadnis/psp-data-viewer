from collections import Counter
import json
import time
from firebase_functions import https_fn, options
from firebase_admin import firestore
import os
import stripe
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime, timedelta, timezone
from azure.cli.core import get_default_cli
from firebase_functions import scheduler_fn


class optionsThing:
    cors_origins = ["https://admin.dataviewer.space"]


@https_fn.on_call(cors=optionsThing)
def fetchMeterUsage(req: https_fn.CallableRequest) -> any:
    cusID = req.data["stripe_customer_id"]
    currentTime = int(datetime.now(timezone.utc).timestamp())
    bottomOfHour = int(int(currentTime) / 3600) * 3600
    print(bottomOfHour)
    stripe.api_key = os.environ.get("STRIPE_TEST")
    sess = stripe.billing.Meter.list_event_summaries(
        "mtr_61S4qmvwfy0rFiix541L6hziDD75cXNQ",
        customer=cusID,
        start_time=bottomOfHour - 604800,
        end_time=bottomOfHour,
        value_grouping_window="hour",
        limit=168,
    )
    print(sess)
    return {"meter": sess}


@https_fn.on_call(cors=optionsThing)
def fetchNextInvoice(req: https_fn.CallableRequest) -> any:
    cusID = req.data["stripe_customer_id"]
    stripe.api_key = os.environ.get("STRIPE_TEST")
    invoice = stripe.Invoice.upcoming(customer=cusID)
    return {"invoice": invoice}


@https_fn.on_call(cors=optionsThing)
def fetchStripePortalLink(req: https_fn.CallableRequest) -> any:
    return_url = req.data["return_url"]
    cusID = req.data["stripe_customer_id"]
    stripe.api_key = os.environ.get("STRIPE_TEST")
    sess = stripe.billing_portal.Session.create(
        customer=cusID,
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
        price="price_1QvSn9L6hziDD75cu25Gsyfp",
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


@scheduler_fn.on_schedule(schedule="every day 00:00")
def sum_daily_instance_usage(event: scheduler_fn.ScheduledEvent) -> None:
    print("running")
    # Logic: get docs in "accounts/{docID}/instance_history" from the last 24 hours.
    # If none exist, sort by the stored time field ("setTime") and get the most recent
    # doc. Multiply the value stored in "instances" of that most recent doc by 86400 (seconds per day)
    # to get seconds used per day.

    # If docs exist for the past day, do the following:
    # - Get most recent doc before docs today (to get instance count at the start of the day)
    # - get delta between each doc timestamp ("setTime") and/or start/end timestamps of the day
    # - multiply each delta by the preceding doc's instance count (so it starts with the most recent doc before the 24hr period * delta)
    # - sum each multiplied "seconds" calculation
    #
    # Finally, send the seconds used per day value to stripe with the meter name "machine_seconds" and "payload[stripe_customer_id]" and
    # "payload[seconds]" set appropriately

    # Do the above logic for each account:
    db = firestore.client()
    dayOldInstanceHistories = (
        db.collection_group("instance_history")
        .where(
            filter=FieldFilter(
                "setTime", ">=", datetime.now(timezone.utc) - timedelta(hours=24)
            )
        )
        .order_by("setTime", direction=firestore.Query.DESCENDING)
    )
    docs = dayOldInstanceHistories.stream()
    dayOldDocs: dict = []
    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
        slug = doc.to_dict()["slug"]
        dayOldDocs.append(doc.to_dict())

    print(dayOldDocs)
    # Extract all slug values
    all_slugs = [doc["slug"] for doc in dayOldDocs]

    # Get unique slugs
    unique_slugs: list[str] = list(set(all_slugs))
    print("Unique slugs:", unique_slugs)

    # Count occurrences of each slug
    slug_counts = Counter(all_slugs)
    print("Slug counts:", dict(slug_counts))

    now = datetime.now(timezone.utc)
    # Create a new datetime object with the same date but time set to 00:00
    today_midnight = datetime(now.year, now.month, now.day, 0, 0, 0)
    today_night = datetime(now.year, now.month, now.day, 23, 59, 59)
    # Convert to timestamp (seconds since epoch)
    startOfDay_s = int(time.mktime(today_midnight.timetuple()))
    endOfDay_s = int(time.mktime(today_night.timetuple()))

    for slug in unique_slugs:
        # Get dayOldDocs + 1
        existingHistoryDocs = slug_counts[slug]
        print(f"fetching {existingHistoryDocs} docs")
        instanceHistories = (
            db.collection_group("instance_history")
            .where(filter=FieldFilter("slug", "==", slug))
            .order_by("setTime", direction=firestore.Query.DESCENDING)
            .limit(existingHistoryDocs + 1)
            .stream()
        )
        lastDoc: dict[str, int] = {}
        currentMachine_s = 0
        for doc in instanceHistories:
            data = doc.to_dict()
            storedTime: datetime = data["setTime"]
            epoch_s = int(storedTime.timestamp())
            newInstances = int(data["instances"])

            # If a doc hasn't been processed yet, either set the first doc
            # as the current time or startOfDay, depending on when the first doc was written
            if lastDoc == {}:
                if epoch_s > startOfDay_s:
                    print("first doc is today")
                    timeDelta = epoch_s - startOfDay_s
                    currentMachine_s += timeDelta * newInstances
                    lastDoc["epoch_s"] = epoch_s
                    lastDoc["instances"] = newInstances
                else:
                    print("first doc is before today")
                    lastDoc["epoch_s"] = startOfDay_s
                    lastDoc["instances"] = newInstances
            else:
                # If there's already been a doc processed, calculate the
                # difference between the current doc and previous doc's time
                # then multiply by instances of previous doc
                print("next doc")
                timeDelta = epoch_s - lastDoc["epoch_s"]
                currentMachine_s += timeDelta * lastDoc["instances"]
                lastDoc["epoch_s"] = epoch_s
                lastDoc["instances"] = newInstances
        print(lastDoc)
        endTimeDelta = endOfDay_s - lastDoc["epoch_s"]
        currentMachine_s += endTimeDelta * lastDoc["instances"]
        print(f"{slug}: {currentMachine_s}")

        # Get Stripe Customer ID:
        docs = (
            db.collection("accounts")
            .where(filter=FieldFilter("slug", "==", slug))
            .stream()
        )
        for doc in docs:
            print(f"{doc.id} => {doc.to_dict()}")
            stripeID = doc.to_dict()["stripe_customer_id"]
        print(f"{slug}: {stripeID}")
        stripe.api_key = os.environ.get("STRIPE_TEST")
        stripe.billing.MeterEvent.create(
            event_name="machine_seconds",
            payload={"stripe_customer_id": stripeID, "seconds": currentMachine_s},
        )

    # return "True"
