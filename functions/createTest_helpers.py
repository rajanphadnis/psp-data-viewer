from datetime import datetime
import time
import gdown

test_list = [
    "DataLog_2024-0430-2328-01_CMS_Data_Wiring_5.tdms",
    "DataLog_2024-0501-0002-02_CMS_Data_Wiring_5.tdms",
    "DataLog_2024-0501-0031-41_CMS_Data_Wiring_5.tdms",
    "DataLog_2024-0430-2328-01_CMS_Data_Wiring_6.tdms",
    "DataLog_2024-0501-0002-02_CMS_Data_Wiring_6.tdms",
    "DataLog_2024-0501-0031-41_CMS_Data_Wiring_6.tdms",
]


def organizeTDMSFiles(file_names: list[str]):
    file_names.sort()
    timestamps: list[int] = []
    for file in file_names:
        time_stamp_str = file[8:25]
        datetimeObj = datetime.strptime(time_stamp_str, "%Y-%m%d-%H%M-%S")
        dateString = time.mktime(datetimeObj.timetuple())
        timestamps.append(int(dateString))
    return (file_names, timestamps)


def downloadFromGDrive(url: str):
    print("new download: " + url)
    file_name = gdown.download(url=url, fuzzy=True)
    return file_name
