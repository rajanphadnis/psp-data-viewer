import json
from firebase_functions import options, https_fn
from firebase_admin import firestore


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    ),
    memory=options.MemoryOption.MB_512,
)
def stripe_customer_created_webhook(req: https_fn.Request) -> https_fn.Response:
    body = req.get_json()
    slug = body["data"]["object"]["metadata"]["slug"]
    name = body["data"]["object"]["name"]
    email = body["data"]["object"]["email"]
    zipCode = body["data"]["object"]["address"]["postal_code"]
    print(f"Slug: {slug}\nName: {name}\nEmail: {email}\nZip Code: {zipCode}")
    docToWrite = {
        "to": ["rajansd28@gmail.com", "admin@dataviewer.space"],
        "message": {
            "subject": f"New Customer: Dataviewer.Space: {slug}",
            "html": f"New customer has signed up:<br/><br/>Slug: {slug}<br/>Name: {name}<br/>Email: {email}<br/>Zip Code: {zipCode}",
            "text": f"New customer has signed up:\n\nSlug: {slug}\nName: {name}\nEmail: {email}\nZip Code: {zipCode}",
        },
    }
    db = firestore.client()
    db.collection("email").add(docToWrite)
    return https_fn.Response(
        json.dumps({"status": "Success"}),
        status=200,
    )
