import azure.functions as func
import logging
import time
import h5py
import pandas as pd
import math
import json
import sys
import requests
import stripe
import os
import simplejson

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="get_data")
def get_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")
    stripe.api_key = os.environ["STRIPE_API_KEY"]
    stripe.billing.MeterEvent.create(
        event_name="api_requests",
        payload={"stripe_customer_id": os.environ["STRIPE_CUSTOMER_ID"]},
    )
    print("logged to stripe")

    maxValsAllowed = 4500

    param_searchStart = req.params.get("start")
    param_searchEnd = req.params.get("end")
    param_channels = req.params.get("channels")
    param_maxVals = req.params.get("max")
    param_testID = req.params.get("id")

    if not param_testID:
        return func.HttpResponse(
            "Test ID is required. Make sure you've provided an 'id=' parameter when calling the API. If you're unsure what Test ID to use, consult psp-admin.rajanphadnis.com or other test documentation",
            status_code=400,
            headers={
                "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                "Access-Control-Allow-Credentials": True,  # Required for cookies, authorization headers with HTTPS
            },
        )
    if param_testID:
        testID: str = param_testID

    if not param_searchStart:
        searchStart: int = 0
    if param_searchStart:
        searchStart = int(param_searchStart)
    if not param_searchEnd:
        searchEnd: int = 0
    if param_searchEnd:
        searchEnd = int(param_searchEnd)

    if not param_maxVals:
        maxVals: int = maxValsAllowed
    if param_maxVals:
        maxVals = int(param_maxVals)

    if not param_channels:
        channels_to_fetch: list[str] = []
    if param_channels:
        channels_to_fetch = param_channels.split(",")

    # #########################
    # TEST VALUES
    # #########################
    # searchStart = 1714537441001
    # searchEnd = 1714537443817 or 1714537554817
    # channels_to_fetch = ["fms__lbf__", "pi-fu-02__bin__", "fu_psi__psi__"]
    # maxVals = 4500
    # url schema: ?id=test&start=1714537441001&end=1714537554817&channels=fms__lbf__,pi-fu-02__bin__&max=20
    # #########################
    # END TEST VALUES
    # #########################

    totalStartTime = time.time()
    df = pd.DataFrame()
    channels_to_fetch.append("time")

    with h5py.File(f"/hdf5data/hdf5_data/{testID}.hdf5", "r") as f:
        for dataset in channels_to_fetch:
            df[dataset] = f[dataset]

    fetchEndTime = time.time()

    if searchStart != 0 and searchEnd != 0:
        filteredDF = df.loc[(df["time"] >= searchStart) & (df["time"] <= searchEnd)]
    elif searchStart != 0 and searchEnd == 0:
        filteredDF = df.loc[(df["time"] >= searchStart)]
    elif searchStart == 0 and searchEnd != 0:
        filteredDF = df.loc[(df["time"] <= searchEnd)]
    else:
        filteredDF = df

    totalLength = len(filteredDF.index)
    nth = math.ceil(totalLength / maxVals)
    if nth <= 1:
        nth = 1
    downsampledDF = filteredDF.iloc[1::nth]
    downsampledLength = len(downsampledDF.index)
    downsampledDF["time"] *= 0.001

    totalPackageTime = time.time()

    dictToReturn = downsampledDF.to_dict(orient="list")

    totalEndTime = time.time()
    dictToReturn["function_exec_time_total_ms"] = (totalEndTime - totalStartTime) * 1000
    dictToReturn["function_exec_time_fetch_ms"] = (fetchEndTime - totalStartTime) * 1000
    dictToReturn["function_exec_time_filter_ms"] = (
        totalPackageTime - fetchEndTime
    ) * 1000
    dictToReturn["function_exec_time_package_ms"] = (
        totalEndTime - totalPackageTime
    ) * 1000
    dictToReturn["entries_per_dataset_returned"] = downsampledLength
    jsonToReturn = simplejson.dumps(
        dictToReturn, ignore_nan=True, separators=(",", ":")
    )

    print(f"return object size in kb: {sys.getsizeof(jsonToReturn) / 1024}")
    return func.HttpResponse(
        body=jsonToReturn,
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
            "Access-Control-Allow-Credentials": True,  # Required for cookies, authorization headers with HTTPS
        },
    )


@app.route(route="get_database_info")
def get_database_info(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")
    stripe.api_key = os.environ["STRIPE_API_KEY"]
    stripe.billing.MeterEvent.create(
        event_name="api:_get_database_info",
        payload={"stripe_customer_id": os.environ["STRIPE_CUSTOMER_ID"]},
    )
    print("logged to stripe")

    param_testID = req.params.get("id")
    param_annotations = req.params.get("annotations")
    if not param_testID:
        return func.HttpResponse(
            "Test ID is required. Make sure you've provided an 'id=' parameter when calling the API. If you're unsure what Test ID to use, consult psp-admin.rajanphadnis.com or other test documentation",
            status_code=400,
            headers={
                "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                "Access-Control-Allow-Credentials": True,  # Required for cookies, authorization headers with HTTPS
            },
        )
    if param_testID:
        testID: str = param_testID

    if not param_annotations:
        param_annotations = "no"

    if param_annotations == "only":
        response = requests.get(
            f"https://get-annotations-w547ikcrwa-uc.a.run.app?id={testID}"
        ).json()
        if "No Annotations" in response:
            annotations = None
        else:
            annotations = {
                "annotations": response,
            }
        if annotations is None:
            return func.HttpResponse(
                body="No Annotations Available",
                status_code=204,
                headers={
                    "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                    "Access-Control-Allow-Credentials": True,  # Required for cookies, authorization headers with HTTPS
                },
            )

        return func.HttpResponse(
            body=json.dumps(annotations),
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                "Access-Control-Allow-Credentials": True,  # Required for cookies, authorization headers with HTTPS
            },
        )
    if param_annotations == "yes":
        totalStartTime = time.time()
        startTime = 0
        endTime = 0
        channel_list = []

        with h5py.File(f"/hdf5data/hdf5_data/{testID}.hdf5", "r") as f:
            # with h5py.File(f"./{testID}.hdf5", "r") as f:
            channel_list = list(f.keys())
            startTime = int(f["time"][0])
            endTime = int(f["time"][-1])

        totalEndTime = time.time()
        dictToReturn = {}
        dictToReturn["function_exec_time_total_ms"] = (
            totalEndTime - totalStartTime
        ) * 1000
        dictToReturn["database_start_time"] = startTime
        dictToReturn["database_end_time"] = endTime
        dictToReturn["database_channel_list"] = channel_list
        response = requests.get(
            f"https://get-annotations-w547ikcrwa-uc.a.run.app?id={testID}"
        ).json()
        if "No Annotations" in response:
            annotations = None
        else:
            annotations = {
                "annotations": response,
            }
        if annotations is not None:
            dictToReturn.update(annotations)
        jsonToReturn = json.dumps(dictToReturn)

        print(f"return object size in kb: {sys.getsizeof(jsonToReturn) / 1024}")
        return func.HttpResponse(
            body=jsonToReturn,
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                "Access-Control-Allow-Credentials": True,  # Required for cookies, authorization headers with HTTPS
            },
        )
    else:
        totalStartTime = time.time()
        startTime = 0
        endTime = 0
        channel_list = []

        with h5py.File(f"/hdf5data/hdf5_data/{testID}.hdf5", "r") as f:
            # with h5py.File(f"./{testID}.hdf5", "r") as f:
            channel_list = list(f.keys())
            startTime = int(f["time"][0])
            endTime = int(f["time"][-1])

        totalEndTime = time.time()
        dictToReturn = {}
        dictToReturn["function_exec_time_total_ms"] = (
            totalEndTime - totalStartTime
        ) * 1000
        dictToReturn["database_start_time"] = startTime
        dictToReturn["database_end_time"] = endTime
        dictToReturn["database_channel_list"] = channel_list
        jsonToReturn = json.dumps(dictToReturn)

        print(f"return object size in kb: {sys.getsizeof(jsonToReturn) / 1024}")
        return func.HttpResponse(
            body=jsonToReturn,
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",  # Required for CORS support to work
                "Access-Control-Allow-Credentials": True,  # Required for cookies, authorization headers with HTTPS
            },
        )
