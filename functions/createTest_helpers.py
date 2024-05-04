from datetime import datetime
import time
import gdown
from psp_liquids_daq_parser import parseCSV, SensorNetData
import pytz

test_list = [
    "DataLog_2024-0430-2328-01_CMS_Data_Wiring_5.tdms",
    "DataLog_2024-0501-0002-02_CMS_Data_Wiring_5.tdms",
    "DataLog_2024-0501-0031-41_CMS_Data_Wiring_5.tdms",
    "DataLog_2024-0430-2328-01_CMS_Data_Wiring_6.tdms",
    "DataLog_2024-0501-0002-02_CMS_Data_Wiring_6.tdms",
    "DataLog_2024-0501-0031-41_CMS_Data_Wiring_6.tdms",
    "timestamped_bangbang_data.csv",
]

csv_test_list = ["timestamped_bangbang_data.csv"]


def organizeFiles(file_names: list[str]):
    csv_files = list(filter(lambda x: ".csv" in x, file_names))
    fileNames = list(filter(lambda x: ".csv" not in x, file_names))
    fileNames.sort()
    timestamps: list[int] = []
    for file in fileNames:
        time_stamp_str = file[8:25]
        datetimeObj = datetime.strptime(time_stamp_str, "%Y-%m%d-%H%M-%S")
        dateString = time.mktime(datetimeObj.timetuple())
        timestamps.append(int(dateString))
    return (fileNames, csv_files, timestamps)


def downloadFromGDrive(url: str):
    print("new download: " + url)
    file_name = gdown.download(url=url, fuzzy=True)
    return file_name


# organizeFiles(test_list)