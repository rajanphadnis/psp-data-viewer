import firebase_admin
from firebase_admin import credentials, firestore, App
import psp_liquids_daq_parser as daq
import pandas as pd
import gorillacompression as gc
import matplotlib.pyplot as plt

# cred: credentials.Certificate = credentials.Certificate(
#     "./psp-portfolio-key.json"
# )

# app: App = firebase_admin.initialize_app(cred)

# db = firestore.client()


test_name = "cms_whoopsie_preop"

parsed_datasets: dict[
    str,
    daq.AnalogChannelData | daq.DigitalChannelData | daq.SensorNetData | list[float],
] = daq.parseTDMS(
    5,
    1714534081000,
    file_path_custom="C:\\Users\\rajan\\Desktop\\PSP_Data\\whoopsie\\DataLog_2024-0430-2328-01_CMS_Data_Wiring_6.tdms",
)
# parsed_datasets.update(
#     daq.parseTDMS(
#         6,
#         1714534081000,
#         file_path_custom="C:\\Users\\rajan\\Desktop\\PSP_Data\\whoopsie\\DataLog_2024-0430-2328-01_CMS_Data_Wiring_6.tdms",
#     )
# )


[channels, df_const] = daq.extendDatasets(parsed_datasets)

csv_parsed_datasets = daq.parseCSV(
    file_path_custom="C:/Users/rajan/Desktop/psp-platform/functions/test_data/timestamped_bangbang_data.csv"
)
channels.append(list(csv_parsed_datasets.keys()))

df = pd.DataFrame.from_dict(df_const)
for dataset in csv_parsed_datasets:
    new_df = pd.DataFrame.from_dict(
        {
            dataset + "_time": csv_parsed_datasets[dataset].time.tolist(),
            dataset: csv_parsed_datasets[dataset].data.tolist(),
        }
    )
    merged_df = pd.merge_asof(
        df.sort_values("time"),
        new_df.sort_values(dataset + "_time"),
        left_on="time",
        right_on=dataset + "_time",
        direction="nearest",
    )
    df = merged_df


dict_to_write: dict[str, list[float]] = {}

all_time: list[float] = df_const["time"]

available_datasets: list[str] = []


# for dataset in df_const:
# dataset = "pt-fu-02"
# if dataset != "time":
#     data: list[float] = df_const[dataset]
# time: list[float] = parsed_datasets[dataset].time.tolist()
# time: list[float] = all_time[: len(data)]
# df = pd.DataFrame.from_dict({"time": time, "data": data})
# df_cut = df.head(15*1000)
# thing = df.iloc[::500, :]
# print("writing csv...")
# df.to_csv(dataset+".csv", lineterminator="\n",index=False)
# print("compressing...")
# c_time = gc.ValuesEncoder.encode_all(all_time)
# c_data = gc.ValuesEncoder.encode_all(data)


# scale = "psi"
# if "tc" in dataset:
#     scale = "deg"
# if "pi-" in dataset or "reed-" in dataset or "_state" in dataset:
#     scale = "bin"
# if "fms" in dataset:
#     scale = "lbf"
# if "rtd" in dataset:
#     scale = "V"
# doc_ref = db.collection(test_name).document(dataset)
# doc_ref.set({"time_offset": (time[0])})
# doc_ref.set(
#     {
#         "data": thing["data"].to_list(),
#         "time": thing["time"].to_list(),
#         "unit": scale,
#     },
#     merge=True,
# )
# available_datasets.append(dataset)
# print(dataset)

# doc_ref = db.collection(test_name).document("general")
# doc_ref.set({"datasets": available_datasets, "test_article": "CMS", "gse_article":"BCLS", "name": "Whoopsie (Per-Op)"}, merge=True)
