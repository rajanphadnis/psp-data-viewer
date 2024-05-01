# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from typing import Any
from firebase_functions import https_fn
from firebase_admin import initialize_app
import base64

initialize_app()

@https_fn.on_call()
def createCSV(req: https_fn.CallableRequest) -> Any:
    data = req.data
    base64_data: str = data["b64"]
    if (base64_data == ""):
        print("exporting all")
        return False
    else:
        test_name = data["test_name"]
        decoded_string = base64.b64decode(str(base64_data)).decode("utf-8")
        print(decoded_string)

        return {
            "csv_fields": decoded_string,
            "name": test_name
        }

@https_fn.on_call()
def createTest(req: https_fn.CallableRequest) -> Any:
    data = req.data
    test_name: str = data["test_name"]
    urls: list[str] = data["url_pair"]
    return {"name": test_name, "first_url": urls[0]}
