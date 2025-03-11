import os
from firebase_functions import options, https_fn
from firebase_admin import firestore
import google.cloud.firestore
import json
from azure.cli.core import get_default_cli


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def get_annotations(req: https_fn.Request) -> https_fn.Response:
    # Get dataset annotations
    test_id = req.args["id"] if "id" in req.args else None
    if test_id is None:
        return https_fn.Response("'id' is required", status=400)
    db: google.cloud.firestore.Client = firestore.client()
    fetchedData = db.collection(test_id).document("annotations").get().to_dict()
    if fetchedData is None:
        return https_fn.Response(
            '{"No Annotations": true}', status=200, mimetype="text/json"
        )
    else:
        return https_fn.Response(
            json.dumps(fetchedData), status=200, mimetype="text/json"
        )


@https_fn.on_call()
def update_test_metadata(req: https_fn.CallableRequest):
    perms = req.auth.token["permissions"]
    test_id = req.data["id"]
    test_name = req.data["name"]
    test_article = req.data["article"]
    test_gse = req.data["gse"]
    db_id = req.data["db_id"]
    slug = req.data["slug"]

    if f"{slug}:manage:tests" in perms:
        db: google.cloud.firestore.Client = firestore.client(database_id=db_id)
        transaction: google.cloud.firestore.Transaction = db.transaction()
        test_ref: google.cloud.firestore.DocumentReference = db.collection(
            test_id
        ).document("general")
        general_ref: google.cloud.firestore.DocumentReference = db.collection(
            "general"
        ).document("tests")

        @firestore.transactional
        def update_in_transaction(
            transaction: google.cloud.firestore.Transaction,
            general_ref: google.cloud.firestore.DocumentReference,
            test_ref: google.cloud.firestore.DocumentReference,
        ):
            list_of_visible: list = general_ref.get(transaction=transaction).get(
                "visible"
            )
            timestamp: int = test_ref.get(transaction=transaction).get(
                "starting_timestamp"
            )
            print(list_of_visible)
            item_to_index = [item for item in list_of_visible if item["id"] == test_id]
            print(item_to_index)
            transaction.update(
                test_ref,
                {
                    "name": test_name,
                    "test_article": test_article,
                    "gse_article": test_gse,
                },
            )
            transaction.update(
                general_ref,
                {"visible": google.cloud.firestore.ArrayRemove(item_to_index)},
            )
            transaction.update(
                general_ref,
                {
                    "visible": google.cloud.firestore.ArrayUnion(
                        [
                            {
                                "id": test_id,
                                "name": test_name,
                                "test_article": test_article,
                                "gse_article": test_gse,
                                "starting_timestamp": timestamp,
                            }
                        ]
                    )
                },
            )
            return True

        result = update_in_transaction(transaction, general_ref, test_ref)
        if result:
            return {"status": "ok"}
        else:
            raise https_fn.HttpsError(
                code=https_fn.FunctionsErrorCode.INTERNAL,
                message=("Something went wrong"),
            )
    else:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.PERMISSION_DENIED,
            message=("User does not have permission to update test metadata"),
        )


@https_fn.on_call(memory=options.MemoryOption.MB_512)
def delete_test(req: https_fn.CallableRequest):
    perms = req.auth.token["permissions"]
    id = req.data["id"]
    db_id = req.data["db_id"]
    slug = req.data["slug"]
    share_name = req.data["share_name"]
    storage_acct_name = req.data["storage_acct_name"]

    appId = os.environ.get("AZURE_APP_ID")
    password = os.environ.get("AZURE_PASSWORD_STRING")
    tenant = os.environ.get("AZURE_TENANT_STRING")

    if f"{slug}:delete:tests" in perms:
        db: google.cloud.firestore.Client = firestore.client(database_id=db_id)
        transaction: google.cloud.firestore.Transaction = db.transaction()
        test_ref: google.cloud.firestore.CollectionReference = db.collection(id)
        general_ref: google.cloud.firestore.DocumentReference = db.collection(
            "general"
        ).document("tests")

        @firestore.transactional
        def update_in_transaction(
            transaction: google.cloud.firestore.Transaction,
            general_ref: google.cloud.firestore.DocumentReference,
            test_ref: google.cloud.firestore.CollectionReference,
        ):
            list_of_visible: list = general_ref.get(transaction=transaction).get(
                "visible"
            )
            print(list_of_visible)
            item_to_index = [item for item in list_of_visible if item["id"] == id]
            print(item_to_index)
            transaction.update(
                general_ref,
                {"visible": google.cloud.firestore.ArrayRemove(item_to_index)},
            )
            transaction.delete(
                test_ref.document("general"),
            )
            return True

        result = update_in_transaction(transaction, general_ref, test_ref)
        print(result)

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
                    "storage",
                    "file",
                    "delete",
                    "--path",
                    f"hdf5_data/{id}.hdf5",
                    "--share-name",
                    share_name,
                    "--account-name",
                    storage_acct_name,
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
            message=("User does not have permission to delete tests"),
        )
