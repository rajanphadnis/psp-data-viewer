from datetime import datetime
import os

import h5py
import time
import numpy as np
import pandas as pd
from psp_liquids_daq_parser import (
    parseCSV,
    parseTDMS,
)


def organizeFiles(file_names: list[str]):
    csv_files = list(filter(lambda x: ".csv" in x, file_names))
    fileNames = list(filter(lambda x: ".csv" not in x, file_names))
    fileNames.sort()
    timestamps: list[int] = []
    for file in fileNames:
        time_stamp_str = file.split("DataLog_")[1][0:17]
        datetimeObj = datetime.strptime(time_stamp_str, "%Y-%m%d-%H%M-%S")
        dateString = time.mktime(datetimeObj.timetuple())
        timestamps.append(int(dateString))
    return (fileNames, csv_files, timestamps)


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


test_id = "local"
tdms_timeSyncDelay_ms = 3650
file_names = [
    "./data/delta_cf1/DataLog_2024-1102-2252-13_CMS_CF_Data_Wiring_5.tdms",
    "./out/pt-fu-201_setpoint_high.csv",
    "./out/pt-fu-201_setpoint_low.csv",
    "./out/pt-fu-201.csv",
    "./out/pt-ox-201_setpoint_high.csv",
    "./out/pt-ox-201_setpoint_low.csv",
    "./out/pt-ox-201.csv",
    "./out/sv-he-201_state.csv",
    "./out/sv-he-202_state.csv",
    "./out/tc-fu-202.csv",
    "./out/tc-ox-202.csv",
]
(tdms_filenames, csv_filenames, starting_timestamps) = organizeFiles(file_names)

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
print(f"Post-processed data in {(writeTimeStart - postProcessingTimeStart)*1000} ms")
print(f"Opened file in {(openFileTime - writeTimeStart)*1000} ms")
print(f"Wrote file in {(writeTimeEnd - writeTimeStart)*1000} ms")
