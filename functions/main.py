# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import math
from multiprocessing import cpu_count
from multiprocessing.pool import ThreadPool
import os
import pickle
from typing import Any
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, App, firestore
import base64
import datetime
from google.cloud import storage
import google.cloud.firestore as fs
from google.oauth2 import service_account
import pandas as pd
from psp_liquids_daq_parser import (
    parseCSV,
    parseTDMS,
    AnalogChannelData,
    DigitalChannelData,
    SensorNetData,
    extendDatasets,
    combineTDMSDatasets,
)
from google.cloud.storage import transfer_manager

from createTest_helpers import downloadFromGDrive, organizeFiles

app: App = initialize_app()


@https_fn.on_call(
    secrets=["GOOGLE_ADC"], timeout_sec=540, memory=options.MemoryOption.GB_8, cpu=2
)
def createCSV(req: https_fn.CallableRequest) -> Any:
    data = req.data
    base64_data: str = data["b64"]
    test_id: str = data["test_id"]
    bucket_name = "psp-data-viewer-storage"
    blob_folder_name = test_id + "/csv_downloads"
    blob_name = "all_channels.csv"
    list_of_channels: list[str]  = []
    with open("adc.json", "w") as file1:
        file1.write(os.environ.get("GOOGLE_ADC"))
    credentials = service_account.Credentials.from_service_account_file("adc.json")
    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.bucket(bucket_name)
    if base64_data == "":
        blob_name = "all_channels.csv"
    else:
        decoded_string = base64.b64decode(str(base64_data)).decode("utf-8")
        list_of_channels = decoded_string.split(",")
        list_of_channels.sort()
        blob_name = ("_".join(list_of_channels)) + ".csv"
    print("blob name: " + blob_name)
    if bucket.blob(blob_folder_name + "/" + blob_name).exists(storage_client):
        print("file exists - getting url")
        blob = bucket.blob(blob_folder_name + "/" + blob_name)
        url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=60),
            method="GET",
        )
        print("Generated GET signed URL:")
        return url
    else:
        print("getting all channel data")
        all_channels_pickle_blob = bucket.blob(test_id + "/all_channels.pickle")
        all_channels_pickle_blob.download_to_filename("all_channels.pickle")
        print("unpickling expanded datasets...")
        with open("all_channels.pickle", "rb") as f:
            data_datasets: dict[str, list[float]] = pickle.loads(f.read())
        print("unpickled expanded datasets")
        print("expanding channels...")
        df = pd.DataFrame.from_dict(data_datasets)
        if base64_data == "":
            print("exporting all")
            df.to_csv(blob_name)
            print("export complete")
        else:
            print("exporting datasets")
            list_of_channels.append("time")
            to_export_channels = list_of_channels
            print(to_export_channels)
            df[to_export_channels].to_csv(blob_name)
            print("export complete")
        print("uploading...")
        blob_to_upload = bucket.blob(blob_folder_name + "/" + blob_name)
        generation_match_precondition = 0
        blob_to_upload.upload_from_filename(
            blob_name,
            content_type="text/csv",
            if_generation_match=generation_match_precondition,
        )
        # results = transfer_manager.upload_many_from_filenames(
        #     bucket,
        #     [blob_name],
        #     blob_name_prefix=blob_folder_name + "/",
        #     source_directory=".",
        #     max_workers=2,
        # )
        # for name, result in zip([blob_name], results):
        #     # The results list is either `None` or an exception for each filename in
        #     # the input list, in order.
        #     if isinstance(result, Exception):
        #         print("Failed to upload {} due to exception: {}".format(name, result))
        #         return False
        #     else:
        print("Uploaded {} to {}.".format(blob_name, bucket.name))
        blob = bucket.blob(blob_folder_name + "/" + blob_name)
        url = blob.generate_signed_url(
            version="v4",
            expiration=datetime.timedelta(minutes=60),
            method="GET",
        )
        print("Generated GET signed URL:")
        return url


@https_fn.on_call(timeout_sec=540, memory=options.MemoryOption.GB_8, cpu=2)
def createTest(req: https_fn.CallableRequest) -> Any:
    data = req.data
    max_entries_per_sensor: int = 4500
    test_name: str = data["test_name"]
    test_id: str = data["test_id"]
    test_article: str = data["test_article"]
    gse_article: str = data["gse_article"]
    url_pairs: list[str] = data["url_pairs"]
    trim_to_s: int = int(float(data["trim_to_s"]))
    file_names: list[str] = []

    print("downloading...")
    cpus = cpu_count()
    results = ThreadPool(cpus - 1).imap_unordered(downloadFromGDrive, url_pairs)
    for result in results:
        file_names.append(result)
        print("downloaded:", result)
    (tdms_filenames, csv_filenames, starting_timestamps) = organizeFiles(file_names)
    parsed_datasets: dict[
        str,
        AnalogChannelData | DigitalChannelData | SensorNetData | list[float],
    ] = []
    file1 = parseTDMS(0, file_path_custom=tdms_filenames[-1])
    file2 = parseTDMS(0, file_path_custom=tdms_filenames[-2])
    parsed_datasets = combineTDMSDatasets(file1, file2)
    if len(csv_filenames) > 0:
        parsed_datasets.update(parseCSV(file_path_custom=csv_filenames[-1]))
    [channels, max_length, data_as_dict] = extendDatasets(parsed_datasets)
    print("pickling data...")
    with open("all_channels.pickle", "wb") as f:
        pickle.dump(data_as_dict, f, pickle.HIGHEST_PROTOCOL)
    print("pickled data")
    file_names.append("all_channels.pickle")

    db = firestore.client()
    all_time: list[float] = data_as_dict["time"]
    available_datasets: list[str] = []
    for dataset in data_as_dict:
        if dataset != "time":
            data: list[float] = data_as_dict[dataset]
            time: list[float] = all_time[: len(data)]
            df = pd.DataFrame.from_dict({"time": time, "data": data})
            if trim_to_s == 0:
                print("not trimming")
                processed_df = df.iloc[:: math.ceil(max_length / max_entries_per_sensor), :]
            else:
                df_cut = df.head(trim_to_s * 1000)
                max_length = len(df_cut.index)
                trim_to_freq = math.ceil(max_length / max_entries_per_sensor)
                print("Trimming to every x samples: " + str(trim_to_freq))
                processed_df = df_cut.iloc[::trim_to_freq, :]
                print(
                    "total rows: "
                    + str(len(df_cut.index))
                    + " -> "
                    + str(len(processed_df.index))
                )

            # print("writing csv...")
            # df.to_csv(dataset+".csv", lineterminator="\n",index=False)

            scale = "psi"
            if "tc" in dataset:
                scale = "deg"
            if "pi-" in dataset or "reed-" in dataset or "_state" in dataset:
                scale = "bin"
            if "fms" in dataset:
                scale = "lbf"
            if "rtd" in dataset:
                scale = "V"
            doc_ref = db.collection(test_id).document(dataset)
            doc_ref.set({"time_offset": (time[0])})
            doc_ref.set(
                {
                    "data": processed_df["data"].to_list(),
                    "time": processed_df["time"].to_list(),
                    "unit": scale,
                },
                merge=True,
            )
            available_datasets.append(dataset)
            print(dataset)

    doc_ref_test_general = db.collection(test_id).document("general")
    doc_ref_test_general.set(
        {
            "datasets": available_datasets,
            "test_article": test_article,
            "gse_article": gse_article,
            "name": test_name,
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

    storage_client = storage.Client()
    bucket = storage_client.bucket("psp-data-viewer-storage")
    print("uploading...")
    results = transfer_manager.upload_many_from_filenames(
        bucket,
        file_names,
        blob_name_prefix=test_id + "/",
        source_directory=".",
        max_workers=6,
    )
    for name, result in zip(file_names, results):
        # The results list is either `None` or an exception for each filename in
        # the input list, in order.
        if isinstance(result, Exception):
            print("Failed to upload {} due to exception: {}".format(name, result))
        else:
            print("Uploaded {} to {}.".format(name, bucket.name))
    return {"name": test_name, "id": test_id}
