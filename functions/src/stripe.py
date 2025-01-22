from firebase_functions import https_fn
from firebase_admin import firestore
import os
import stripe
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime, timezone


class optionsThing:
    cors_origins = ["http://localhost:3000"]


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
        limit=168
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
