from datetime import datetime
import time as t
import gdown

# test_list = [
#     "DataLog_2024-0430-2328-01_CMS_Data_Wiring_5.tdms",
#     "DataLog_2024-0501-0002-02_CMS_Data_Wiring_5.tdms",
#     "DataLog_2024-0501-0031-41_CMS_Data_Wiring_5.tdms",
#     "DataLog_2024-0430-2328-01_CMS_Data_Wiring_6.tdms",
#     "DataLog_2024-0501-0002-02_CMS_Data_Wiring_6.tdms",
#     "DataLog_2024-0501-0031-41_CMS_Data_Wiring_6.tdms",
#     "timestamped_bangbang_data.csv",
# ]


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


def downloadFromGDrive(url: str):
    print("new download: " + url)
    file_name = gdown.download(url=url, fuzzy=True)
    return file_name


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