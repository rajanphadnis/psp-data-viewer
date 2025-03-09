from datetime import datetime, timedelta
from azure.storage.fileshare import (
    FileSasPermissions,
    generate_share_sas,
)
from firebase_admin import firestore
from firebase_functions import https_fn
from google.cloud.firestore_v1.base_query import FieldFilter


class optionsThing:
    cors_origins = [
        # "https://admin.dataviewer.space"
        "*"
    ]


@https_fn.on_call(cors=optionsThing)
def generate_sas_token(req: https_fn.CallableRequest):
    perms = req.auth.token
    slug = req.data["slug"]
    file_name = req.data["fileName"]
    db = firestore.client()
    key_ref = db.collection("api_access").document("acct_keys")
    doc = key_ref.get()
    if doc.exists:
        print(f"Document data: {doc.to_dict()}")
        STORAGE_ACCOUNT_KEY = doc.to_dict()[slug]
    else:
        raise ValueError("Failed to fetch storage keys")

    accts = (
        db.collection("accounts")
        .where(filter=FieldFilter("slug", "==", slug))
        .limit(1)
        .stream()
    )

    for acct in accts:
        acct_data = acct.to_dict()
        STORAGE_ACCOUNT_NAME = acct_data["azure_storage_account"]
        SHARE_NAME = acct_data["azure_share_name"]

    if not STORAGE_ACCOUNT_KEY:
        raise ValueError(
            "Storage account key is missing for this account. Contact Dataviewer.Space for help"
        )
    if not file_name:
        raise ValueError(
            "Storage account key is missing for this account. Contact Dataviewer.Space for help"
        )
    if not STORAGE_ACCOUNT_NAME:
        raise ValueError(
            f"Failed to fetch storage account for slug `{slug}`. Contact Dataviewer.Space for help"
        )
    if not SHARE_NAME:
        raise ValueError(
            f"Failed to fetch share name for slug `{slug}`. Contact Dataviewer.Space for help"
        )

    # Set expiration time for SAS token
    expires_on = datetime.now() + timedelta(minutes=30)  # 30-min expiry

    is_read_token = True
    permission = FileSasPermissions(read=True, create=False, write=False, delete=False)
    if f"{slug}:manage:tests" in perms["permissions"]:
        is_read_token = False
        permission = FileSasPermissions(
            read=True, create=True, write=True, delete=False
        )

    # Generate the SAS token
    sas_token = generate_share_sas(
        account_name=STORAGE_ACCOUNT_NAME,
        share_name=SHARE_NAME,
        account_key=STORAGE_ACCOUNT_KEY,
        permission=permission,
        expiry=expires_on,
    )

    return {"sas_token": sas_token, "token_type": "read" if is_read_token else "create"}
