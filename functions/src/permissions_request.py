from base64 import b64decode
import os
import subprocess
from firebase_functions import options, https_fn
import json
from azure.cli.core import get_default_cli
import stripe
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_admin import storage
from firebase_functions.firestore_fn import (
    on_document_created,
    on_document_deleted,
    on_document_updated,
    on_document_written,
    Event,
    Change,
    DocumentSnapshot,
)


@https_fn.on_call(memory=options.MemoryOption.MB_512)
def handle_permissions_decision(req: https_fn.CallableRequest):
    approve: bool = req.data["decision"]
    email: str = req.data["email"]
    org: str = req.data["slug"]

    db = firestore.client()
    docs = (
        db.collection("permissions_requests")
        .where(filter=FieldFilter("email", "==", email))
        .stream()
    )

    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
        requestCode: str = doc.to_dict()["requestCode"]
        docID = doc.id

    request = b64decode(requestCode).decode("UTF-8")
    print(request)
    perms = request.split(":::")[1].split("::")
    if approve:
        db.collection("access_control").document("users").update(
            {f"`{email}`": firestore.ArrayUnion(perms)}
        )
    db.collection("permissions_requests").document(docID).delete()
    db.collection("email").add(
        {
            "to": email,
            "message": {
                "subject": "Permissions Request Approved"
                if approve
                else "Permissions Request Denied",
                "html": f'Your Dataviewer.Space permissions request for the "{org}" organization has been {"approved. Please log out and log back in to use your new permissions." if approve else "denied. If you think this was an error, go ahead and re-submit a permissions request. Make sure to request only the permissions you actually need."}<br/><br/>Best,<br/>The Dataviewer.Space Team<br/><br/>Note: This email was sent from an unmonitored account',
                "text": f"Permissions request {'approved' if approve else 'denied'}",
            },
        }
    )
    return True


@on_document_created(document="permissions_requests/{docID}")
def send_permissions_request_email(event: Event[DocumentSnapshot]) -> None:
    recipients = event.data.to_dict()["recipients"]
    requestCode = event.data.to_dict()["requestCode"]
    slug = event.data.to_dict()["slug"]
    email = b64decode(requestCode).decode("UTF-8").split(":::")[0]
    requestedPermissions = (
        b64decode(requestCode).decode("UTF-8").split(":::")[1].split("::")
    )

    approveURL = f"https://admin.dataviewer.space/{slug}/permissionsRequest/approve/{requestCode}/"

    denyURL = (
        f"https://admin.dataviewer.space/{slug}/permissionsRequest/deny/{requestCode}/"
    )

    message = f'Hi!<br/>As a manager of the Dataviewer.Space "{slug}" organization, you have the ability to approve/deny permissions requests from others in your organization. The following permissions request requires a response:<br/><br/>Requestor: {email}<br/>Requesting Permissions: {", ".join(requestedPermissions)}<br/>'

    approveButton = f'<a href="{approveURL}"><button style="padding:12px;background-color:#00a63e;color:white;margin:10px;font-weight:bold;">Approve Request</button></a>'
    denyButton = f'<a href="{denyURL}"><button style="padding:12px;background-color:#fb2c36;color:white;margin:10px;font-weight:bold;">Deny Request</button></a>'

    fullMessage = f'${message}<div style="display:flex;flex-direction:row;align-items:center;justify-content:evenly;width:100%;">{approveButton}{denyButton}</div>'

    docToWrite = {
        "to": recipients,
        "message": {
            "subject": "Permissions Request: Dataviewer.Space",
            "html": fullMessage,
            "text": f"{email} is requesting the following permissions: {', '.join(requestedPermissions)}.\n\nTo Approve this request, go to this url: {approveURL}\n\nTo Deny this request, go to this url: {denyURL}",
        },
    }
    db = firestore.client()
    db.collection("email").add(docToWrite)
    docs = (
        db.collection("permissions_requests")
        .where(filter=FieldFilter("email", "==", email))
        .stream()
    )

    for doc in docs:
        print(f"{doc.id} => {doc.to_dict()}")
        db.collection("permissions_requests").document(doc.id).update(
            {"status": "Request Sent"}
        )
