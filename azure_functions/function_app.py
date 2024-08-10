import azure.functions as func
import logging
import time
import h5py
import pandas as pd
import math
import json
import sys

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.route(route="get_data")
def get_data(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

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
        )
    if param_testID:
        testID: str = param_testID

    if not param_searchStart:
        searchStart:int = 0
    if param_searchStart:
        searchStart = int(param_searchStart)
    if not param_searchEnd:
        searchEnd: int = 0
    if param_searchEnd:
        searchEnd = int(param_searchEnd)

    if not param_maxVals:
        maxVals: int = maxValsAllowed
    if param_maxVals:
        maxVals = (
            int(param_maxVals)
            if (int(param_maxVals) <= maxValsAllowed)
            else maxValsAllowed
        )

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
        # with h5py.File("./test.hdf5", "r") as f:
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
    downsampledDF = filteredDF.iloc[1::nth]
    downsampledLength = len(downsampledDF.index)

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
    jsonToReturn = json.dumps(dictToReturn)

    # print(f"Fetched all data in {(fetchEndTime - totalStartTime)*1000} ms")
    # print(f"downsampled and filtered in {(totalPackageTime - fetchEndTime)*1000} ms")
    # print(f"packaged in {(totalEndTime - totalPackageTime)*1000} ms")
    # print(filteredDF)
    print(f"return object size in kb: {sys.getsizeof(jsonToReturn) / 1024}")
    return func.HttpResponse(
        jsonToReturn,
        status_code=200,
    )
