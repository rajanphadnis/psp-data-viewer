# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app

initialize_app()


@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    base64_datasets: str = req.args["b64"]
    test_name: str = req.args["test"]
    
    return https_fn.Response(status=200, response="Hello world!")

