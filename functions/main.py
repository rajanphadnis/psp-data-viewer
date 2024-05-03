# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from multiprocessing import cpu_count
from multiprocessing.pool import ThreadPool
import os
from typing import Any
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, App
import base64
import datetime
from google.cloud import storage
from google.oauth2 import service_account

from google.cloud.storage import Client, transfer_manager

from functions.createTest_helpers import downloadFromGDrive, organizeTDMSFiles
app: App = initialize_app()

@https_fn.on_call(secrets=["GOOGLE_ADC"])
def createCSV(req: https_fn.CallableRequest) -> Any:
    data = req.data
    base64_data: str = data["b64"]
    test_name: str = data["test_name"]
    # if (base64_data == ""):
    #     print("exporting all")
    #     return False
    # else:
    #     decoded_string = base64.b64decode(str(base64_data)).decode("utf-8")
    #     print(decoded_string)
    #     return {
    #         "csv_fields": decoded_string,
    #         "name": test_name
    #     }
    bucket_name = 'psp-data-viewer-storage'
    blob_folder_name = 'cms_whoopsie'
    blob_name = "DataLog_2024-0430-2328-01_CMS_Data_Wiring_6.tdms"
    with open("adc.json", "w") as file1:
        file1.write(os.environ.get('GOOGLE_ADC'))
    credentials = service_account.Credentials.from_service_account_file("adc.json")
    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_folder_name + "/" + blob_name)
    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(minutes=60),
        method="GET",
    )
    print("Generated GET signed URL:")
    return url

@https_fn.on_call(timeout_sec=360, memory=options.MemoryOption.GB_2)
def createTest(req: https_fn.CallableRequest) -> Any:
    data = req.data
    test_name: str = data["test_name"]
    test_id: str = data["test_id"]
    test_article: str = data["test_article"]
    gse_article: str = data["gse_article"]
    url_pair: list[str] = data["url_pairs"]
    file_names: list[str] = []
    # output = "C:\\Users\\rajan\\Desktop\\psp-platform\\functions\\test_small.tdms"
    # for url in url_pair:
    #     # url = "https://drive.google.com/file/d/1-K6kYFNGwkccVDpCWeNJHEILtO-naTVs/view?usp=sharing"
    #     # url_big = "https://drive.google.com/file/d/1Fqfqqwd9GL9sjCOnsgoKou55RBKDQs6L/view?usp=drive_link"
    #     file_name = gdown.download(url=url, fuzzy=True)
    #     file_names.append(file_name)
    #     print(file_name)
    print("downloading...")
    cpus = cpu_count()
    results = ThreadPool(cpus - 1).imap_unordered(downloadFromGDrive, url_pair)
    for result in results:
        file_names.append(result)
        print('downloaded:', result)

    (file_names, timestamps) = organizeTDMSFiles(file_names)

    storage_client = storage.Client()
    bucket = storage_client.bucket("psp-data-viewer-storage")
    print("uploading...")
    results = transfer_manager.upload_many_from_filenames(
        bucket, file_names, blob_name_prefix=test_id + "/", source_directory=".", max_workers=6
    )
    for name, result in zip(file_names, results):
        # The results list is either `None` or an exception for each filename in
        # the input list, in order.
        if isinstance(result, Exception):
            print("Failed to upload {} due to exception: {}".format(name, result))
        else:
            print("Uploaded {} to {}.".format(name, bucket.name))
    return {"name": test_name, "first_url": url_pair[0]}

