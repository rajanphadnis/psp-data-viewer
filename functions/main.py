# from concurrent.futures import ThreadPoolExecutor
from multiprocessing import cpu_count
import os
import time
# from typing import Any
from firebase_functions import options
from firebase_admin import initialize_app, App, storage, firestore
import google.cloud.firestore as fs
import numpy as np
import pandas as pd
from psp_liquids_daq_parser import (
    parseCSV,
    parseTDMS,
)
from google.cloud.storage import transfer_manager
import requests
from firebase_functions.firestore_fn import (
    on_document_created,
    Event,
    DocumentSnapshot,
)
import h5py
from azure.core.exceptions import ResourceExistsError, ResourceNotFoundError
from datetime import datetime
import time as t
# import gdown
from azure.storage.fileshare import ShareFileClient
import google.cloud.firestore

app: App = initialize_app()
storage_client = storage
# db: google.cloud.firestore.Client = fstore.client()

def organizeFiles(file_names: list[str]):
    csv_files = list(filter(lambda x: ".csv" in x, file_names))
    fileNames = list(filter(lambda x: ".csv" not in x, file_names))
    fileNames.sort()
    timestamps: list[int] = []
    for file in fileNames:
        time_stamp_str = file[8:25]
        datetimeObj = datetime.strptime(time_stamp_str, "%Y-%m%d-%H%M-%S")
        dateString = t.mktime(datetimeObj.timetuple())
        timestamps.append(int(dateString))
    return (fileNames, csv_files, timestamps)

# def downloadFromGDrive(url: str):
#     print("new download: " + url)
#     file_name = gdown.download(url=url, fuzzy=True)
#     return file_name

def getUnits(dataset_name: str) -> str:
    scale = "psi"
    if "tc" in dataset_name:
        scale = "deg"
    if "pi-" in dataset_name or "reed-" in dataset_name or "_state" in dataset_name:
        scale = "bin"
    if "fms" in dataset_name:
        scale = "lbf"
    if "rtd" in dataset_name:
        scale = "V"
    return scale

# @https_fn.on_call(timeout_sec=540, memory=options.MemoryOption.GB_8, cpu=2)
# def createTest_links_gdrive(req: https_fn.CallableRequest) -> Any:
#     data = req.data
#     # link_list = [
#     #     "https://drive.google.com/file/d/10M68NfEW9jlU1XMyv5ubRzIoKsWTQ_MY/view?usp=sharing",  # csv
#     #     "https://drive.google.com/file/d/1zoMto1MpyK6P62iSg0Jz-AfUzmVBy5ZE/view?usp=sharing",  # 2328_5
#     #     "https://drive.google.com/file/d/1SKDAxE1udwTQtjbmGNZapU4nRv1hGNZT/view?usp=sharing",  # 2328_6
#     #     "https://drive.google.com/file/d/1VHZuGHIgEyeKf51VhEe-x6qHaHeBqLAx/view?usp=sharing",  # 0002_5
#     #     "https://drive.google.com/file/d/1TPiCOGoa8BtZgm8iOaN-polQceFXyOke/view?usp=sharing",  # 0002_6
#     # ]
#     # https://drive.google.com/file/d/1SKDAxE1udwTQtjbmGNZapU4nRv1hGNZT/view?usp=sharing,
#     # https://drive.google.com/file/d/1TPiCOGoa8BtZgm8iOaN-polQceFXyOke/view?usp=sharing,
#     # https://drive.google.com/file/d/1VHZuGHIgEyeKf51VhEe-x6qHaHeBqLAx/view?usp=sharing,
#     # https://drive.google.com/file/d/1zoMto1MpyK6P62iSg0Jz-AfUzmVBy5ZE/view?usp=sharing
#     test_name: str = data["test_name"]
#     test_id: str = data["test_id"]
#     test_article: str = data["test_article"]
#     gse_article: str = data["gse_article"]
#     links: list[str] = data["links"]
#     tdms_timeSyncDelay_ms: int = data["tdms_timeSyncDelay_ms"]
#     file_names: list[str] = []
#     file_links: list[str] = []
#     cpus = cpu_count()
#     with ThreadPoolExecutor(max_workers=cpus - 1) as executor:
#         results = executor.map(downloadFromGDrive, links)
#         for result in results:
#             file_names.append(result)
#             print("downloaded:", result)
#     uploadResults = transfer_manager.upload_many_from_filenames(
#         storage_client.bucket(),
#         file_names,
#         max_workers=cpus - 1,
#         blob_name_prefix=f"{test_id}/raw-files/",
#     )
#     print("upload finished")
#     for name, uploadResult in zip(file_names, uploadResults):
#         if isinstance(uploadResult, Exception):
#             print("Failed to upload {} due to exception: {}".format(name, uploadResult))
#             raise https_fn.HttpsError(
#                 code=https_fn.FunctionsErrorCode.DATA_LOSS,
#                 message=(
#                     "Failed to upload {} due to exception: {}".format(
#                         name, uploadResult
#                     )
#                 ),
#             )

#         else:
#             print("Uploaded {} to {}.".format(name, storage_client.bucket().name))
#             blob = storage_client.bucket().blob(f"{test_id}/raw-files/{name}")
#             file_links.append(blob.public_url)
#             print(os.path.getsize(name))
#     print(file_links)
#     firestore_payload = {
#         "id": test_id,
#         "name": test_name,
#         "gse_article": gse_article,
#         "test_article": test_article,
#         "creation_status": "File upload complete",
#         "creation_status_next_step": "Preparing database parsing...",
#         "creation_status_max_steps": 6,
#         "creation_status_current": 2,
#         "file_names": list(file_names),
#         "tdms_timeSyncDelay_ms": tdms_timeSyncDelay_ms,
#     }
#     doc_ref_test_general = db.collection(test_id).document("test_creation")
#     doc_ref_test_general.set(
#         firestore_payload,
#         merge=True,
#     )
#     print("firestore write complete")
#     return {
#         "creation_status": "File upload complete",
#         "creation_status_next_step": "Preparing files...",
#         "creation_status_max_steps": 6,
#         "creation_status_current": 2,
#     }


@on_document_created(document="{testID}/test_creation", memory=options.MemoryOption.GB_8, cpu=2)
def createTest_createHDF5(event: Event[DocumentSnapshot]) -> None:
    data = event.data.to_dict()
    test_name: str = data["name"]
    test_id: str = data["id"]
    test_article: str = data["test_article"]
    gse_article: str = data["gse_article"]
    file_links: list[str] = data["file_names"]
    file_names: list[str] = []
    tdms_timeSyncDelay_ms: int = data["tdms_timeSyncDelay_ms"]
    cpus = cpu_count()

    print("downloading...")

    downloadResults = transfer_manager.download_many_to_path(
        storage_client.bucket(),
        file_links,
        max_workers=cpus - 1,
        blob_name_prefix=f"{test_id}/raw-files/",
        destination_directory="./",
    )
    for name, uploadResult in zip(file_links, downloadResults):
        if isinstance(uploadResult, Exception):
            print(
                "Failed to download {} due to exception: {}".format(name, uploadResult)
            )
        else:
            print("Downloaded {}".format(name))
            file_names.append(name)

    (tdms_filenames, csv_filenames, starting_timestamps) = organizeFiles(file_names)
    db: google.cloud.firestore.Client = firestore.client()
    firestore_payload = {
        "creation_status": "TDMS & CSV files prepared",
        "creation_status_next_step": "Writing HDF5 database...",
        "creation_status_max_steps": 6,
        "creation_status_current": 3,
    }
    doc_ref_test_general = db.collection(test_id).document("test_creation")
    doc_ref_test_general.update(
        firestore_payload,
        # merge=True,
    )

    postProcessingTimeStart = time.time()

    masterDF = pd.DataFrame.from_dict({"time": []})

    for tdmsFile in tdms_filenames:
        print(os.path.getsize(tdmsFile))
        fileData = parseTDMS(0, file_path_custom=tdmsFile)
        updatedColumnNames = {
            "time": (np.array(fileData["time"]) * 1000) + tdms_timeSyncDelay_ms
        }
        for dataset in fileData:
            if dataset != "time":
                updatedColumnNames[f"{dataset}__{getUnits(dataset)}__"] = fileData[
                    dataset
                ].data.tolist()
                print(len(updatedColumnNames[f"{dataset}__{getUnits(dataset)}__"]))
        df = pd.DataFrame.from_dict(updatedColumnNames)
        df = df.dropna(subset=["time"])
        if masterDF.empty:
            masterDF = df
        else:
            masterDF = (
                masterDF.merge(
                    df,
                    how="outer",
                    on="time",
                    suffixes=["---merge---x", "---merge---y"],
                )
                .T.groupby(lambda x: x.split("---merge---")[0])
                .last()
                .T
            )

    for csvFile in csv_filenames:
        csvData = parseCSV(file_path_custom=csvFile)
        for datasetName in csvData:
            dataset = csvData[datasetName]
            df = pd.DataFrame.from_dict(
                {
                    "time": np.rint(dataset.time * 1000),
                    f"{datasetName}__{getUnits(datasetName)}__": dataset.data.tolist(),
                }
            )
            df = df.dropna(subset=["time"])
            if masterDF.empty:
                masterDF = df
            else:
                masterDF = masterDF.merge(df, how="outer", on="time", copy=False)

    masterDF = masterDF.ffill().bfill()

    masterDF["time"] = masterDF["time"].round()
    masterDF["time"] = masterDF["time"].astype("Int64")
    masterDF = masterDF.sort_values("time")

    writeTimeStart = time.time()
    with h5py.File(f"{test_id}.hdf5", "w") as f:
        cols = masterDF.columns.tolist()
        openFileTime = time.time()
        for col in cols:
            startTime = time.time()
            dset = f.create_dataset(col, data=masterDF[col])
            endTime = time.time()
            print(f"Wrote {dset.name} in {(endTime - startTime)*1000} ms")
    writeTimeEnd = time.time()
    print(
        f"Post-processed data in {(writeTimeStart - postProcessingTimeStart)*1000} ms"
    )
    print(f"Opened file in {(openFileTime - writeTimeStart)*1000} ms")
    print(f"Wrote file in {(writeTimeEnd - writeTimeStart)*1000} ms")

    blob = storage_client.bucket().blob(f"{test_id}/raw-files/{test_id}.hdf5")
    blob.upload_from_filename(f"{test_id}.hdf5")

    firestore_payload = {
        "creation_status": "HDF5 Created",
        "creation_status_next_step": "Uploading database...",
        "creation_status_max_steps": 6,
        "creation_status_current": 4,
    }
    doc_ref_test_general = db.collection(test_id).document("test_creation")
    doc_ref_test_general.update(
        firestore_payload,
        # merge=True,
    )
    doc_ref_done = db.collection(test_id).document("ready_to_deploy")
    doc_ref_done.set(
        {
            "id": test_id,
            "name": test_name,
            "gse_article": gse_article,
            "test_article": test_article,
        },
        merge=True,
    )


@on_document_created(timeout_sec=540, document="{testID}/ready_to_deploy", memory=options.MemoryOption.GB_8, cpu=2)
def uploadToAzure(event: Event[DocumentSnapshot]) -> None:
    data = event.data.to_dict()
    test_name: str = data["name"]
    test_id: str = data["id"]
    test_article: str = data["test_article"]
    gse_article: str = data["gse_article"]
    share_name = "psp-data-viewer3d1877"
    db: google.cloud.firestore.Client = firestore.client()
    storage_client.bucket().blob(
        f"{test_id}/raw-files/{test_id}.hdf5"
    ).download_to_filename(f"./{test_id}.hdf5")

    try:
        source_file = open(f"./{test_id}.hdf5", "rb")
        data = source_file.read()

        # Create a ShareFileClient from a connection string
        file_client = ShareFileClient.from_connection_string(
            os.environ.get("AZURE_CONNECTION_STRING"),
            share_name,
            f"hdf5_data/{test_id}.hdf5",
        )

        print("Uploading to:", share_name + "/" + f"hdf5_data/{test_id}.hdf5")
        file_client.upload_file(data)

    except ResourceExistsError as ex:
        print("ResourceExistsError:", ex.message)

    except ResourceNotFoundError as ex:
        print("ResourceNotFoundError:", ex.message)

    except Exception as ex:
        print("exception:", ex.message)

    print("file upload complete")

    firestore_payload = {
        "creation_status": "Database uploaded",
        "creation_status_next_step": "Finalizing database entries...",
        "creation_status_max_steps": 6,
        "creation_status_current": 5,
    }
    doc_ref_test_general = db.collection(test_id).document("test_creation")
    doc_ref_test_general.update(
        firestore_payload,
        # merge=True,
    )
    response = requests.get(
        f"https://psp-api.rajanphadnis.com/api/get_database_info?id={test_id}"
    ).json()
    doc_ref_test_general = db.collection(test_id).document("general")
    doc_ref_test_general.set(
        {
            "id": test_id,
            "name": test_name,
            "gse_article": gse_article,
            "test_article": test_article,
            "azure_datasets": response["database_channel_list"],
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
    firestore_payload = {
        "creation_status": "Test creation complete",
        "creation_status_next_step": "",
        "creation_status_max_steps": 6,
        "creation_status_current": 6,
    }
    doc_ref_test_general = db.collection(test_id).document("test_creation")
    doc_ref_test_general.update(
        firestore_payload,
        # merge=True,
    )
