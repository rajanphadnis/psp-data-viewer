import os
from firebase_admin import firestore
from firebase_functions import https_fn
import requests
import google.cloud.firestore as fs
import stripe


class optionsThing:
    cors_origins = [
        # "https://admin.dataviewer.space"
        "*"
    ]


@https_fn.on_call(cors=optionsThing)
def create_new_dataset(req: https_fn.CallableRequest):
    gse_article = req.data["gse_article"]
    test_id = req.data["test_id"]
    test_name = req.data["test_name"]
    test_article = req.data["test_article"]
    api_base_url = req.data["api_base_url"]
    db_id = req.data["db_id"]
    stripeID = req.data["stripeID"]

    db = firestore.client(database_id=db_id)

    response = requests.get(f"{api_base_url}/get_database_info?id={test_id}").json()

    test_general_ref = db.collection(test_id).document("general")
    channel_list = response["database_channel_list"]
    try:
        channel_list.remove("time")
    except ValueError:
        pass

    test_general_ref.set(
        {
            "id": test_id,
            "name": test_name,
            "gse_article": gse_article,
            "test_article": test_article,
            "azure_datasets": channel_list,
            "starting_timestamp": response["database_start_time"],
            "ending_timestamp": response["database_end_time"],
        },
        merge=True,
    )
    general_doc_ref = db.collection("general").document("tests")
    general_doc_ref.update(
        {
            "visible": fs.ArrayUnion(
                [
                    {
                        "id": test_id,
                        "test_article": test_article,
                        "gse_article": gse_article,
                        "name": test_name,
                    }
                ]
            )
        }
    )
    stripe.api_key = os.environ.get("STRIPE_TEST")
    stripe.billing.MeterEvent.create(
        event_name="tests_created",
        payload={"stripe_customer_id": stripeID},
    )
    return {"status": "complete"}
