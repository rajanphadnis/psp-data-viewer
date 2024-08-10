import math
import time
import pandas as pd
import h5py
import boto3


def getData(event):
    s3 = boto3.client("s3")
    # response = s3.get_object(Bucket="psp-data-platform", Key="tdms_data.hdf5")
    # s3 = boto3.resource("s3")
    with open("./test.hdf5", "wb") as f:
        s3.download_fileobj(
            Bucket="psp-data-platform", Key="tdms_data.hdf5", Fileobj=f
        )
    # response = s3.get_object(Bucket="psp-data-platform", Key="tdms_data.hdf5")
    # searchStart = 0
    # searchEnd = 39823
    searchStart = 1714537441001
    searchEnd = 1714537443817
    channel_to_fetch = ["fms__lbf__", "pi-fu-02__bin__", "fu_psi__psi__"]
    maxVals = 4500

    totalStartTime = time.time()
    df = pd.DataFrame()
    avgPerfTime = []

    with h5py.File("./test.hdf5", "r") as f:
        channel_to_fetch.append("time")
        datasets = list(f.keys())
        for dataset in channel_to_fetch:
            startTime = time.time()
            dset = f[dataset]
            endTime = time.time()
            avgPerfTime.append((endTime - startTime) * 1000)
            df[dataset] = dset

    # print(f'Avg fetch time per channel: {statistics.fmean(avgPerfTime)} ms')

    fetchEndTime = time.time()
    totalLength = len(df.index)
    nth = math.ceil(totalLength / maxVals)
    print(nth)

    downsampledDF = df.iloc[1::nth]

    filteredDF = df.iloc[1::nth].loc[
        (df["time"] >= searchStart) & (df.iloc[1::nth]["time"] <= searchEnd)
    ]

    totalEndTime = time.time()
    print(f"Fetched all data in {(fetchEndTime - totalStartTime)*1000} ms")
    print(f"downsampled and filtered in {(totalEndTime - fetchEndTime)*1000} ms")
    print(filteredDF)
    return "nth"

    # print("done")


eventJSON = {"key": "val"}

getData(eventJSON)
