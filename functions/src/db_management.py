import os
from firebase_functions import options, https_fn
from firebase_admin import storage, firestore
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


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def updateTestMetaData(req: https_fn.Request) -> https_fn.Response:
    # Comments
    test_id = req.args["id"] if "id" in req.args else None
    test_name = req.args["name"] if "name" in req.args else None
    test_article = req.args["article"] if "article" in req.args else None
    test_gse = req.args["gse"] if "gse" in req.args else None
    if test_id is None:
        return https_fn.Response("'id' is required", status=400)
    if test_name is None:
        return https_fn.Response("'name' is required", status=400)
    if test_article is None:
        return https_fn.Response("'article' is required", status=400)
    if test_gse is None:
        return https_fn.Response("'gse' is required", status=400)
    db: google.cloud.firestore.Client = firestore.client()
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
        list_of_visible: list = general_ref.get(transaction=transaction).get("visible")
        timestamp: int = test_ref.get(transaction=transaction).get("starting_timestamp")
        print(list_of_visible)
        item_to_index = [item for item in list_of_visible if item["id"] == test_id]
        print(item_to_index)
        transaction.update(
            test_ref,
            {"name": test_name, "test_article": test_article, "gse_article": test_gse},
        )
        transaction.update(
            general_ref, {"visible": google.cloud.firestore.ArrayRemove(item_to_index)}
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
        return https_fn.Response(json.dumps({"status": "ok"}), status=200)
    else:
        return https_fn.Response(
            json.dumps({"status": "Something went wrong"}), status=500
        )

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def deleteTest(req: https_fn.Request) -> https_fn.Response:
    # Comments
    id = req.args["id"] if "id" in req.args else None
    if id is None:
        return https_fn.Response(json.dumps({"status": "'id' is required"}), status=400)
    appId = os.environ.get("AZURE_APP_ID")
    password = os.environ.get("AZURE_PASSWORD_STRING")
    tenant = os.environ.get("AZURE_TENANT_STRING")

    print(appId)
    print(password)
    print(tenant)

    db: google.cloud.firestore.Client = firestore.client()
    transaction: google.cloud.firestore.Transaction = db.transaction()
    test_ref: google.cloud.firestore.CollectionReference = db.collection(id)
    general_ref: google.cloud.firestore.DocumentReference = db.collection(
        "general"
    ).document("tests")

    bucket = storage.bucket()
    blobs = bucket.list_blobs(prefix=f"{id}/")

    for blob in blobs:
        blob.delete()
        print(f"Deleted {blob.name}")

    @firestore.transactional
    def update_in_transaction(
        transaction: google.cloud.firestore.Transaction,
        general_ref: google.cloud.firestore.DocumentReference,
        test_ref: google.cloud.firestore.CollectionReference,
    ):
        list_of_visible: list = general_ref.get(transaction=transaction).get("visible")
        print(list_of_visible)
        item_to_index = [item for item in list_of_visible if item["id"] == id]
        print(item_to_index)
        transaction.update(
            general_ref, {"visible": google.cloud.firestore.ArrayRemove(item_to_index)}
        )
        transaction.delete(
            test_ref.document("general"),
        )
        transaction.delete(
            test_ref.document("ready_to_deploy"),
        )
        transaction.delete(
            test_ref.document("test_creation"),
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
        # thing = get_default_cli().invoke(["webapp", "config", "storage-account", "list", "--resource-group", "pspdataviewer", "--name", "psp-data-viewer-api"])
        thing = get_default_cli().invoke(
            [
                "storage",
                "file",
                "delete",
                "--path",
                f"hdf5_data/{id}.hdf5",
                "--share-name",
                "psp-data-viewer3d1877",
                "--account-name",
                "pspdataviewer",
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
