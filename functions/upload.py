import firebase_admin
from firebase_admin import credentials, firestore, App
import psp_liquids_daq_parser as daq
import pandas as pd
import gorillacompression as gc

# Use a service account.
cred: credentials.Certificate = credentials.Certificate(
    "./psp-portfolio-f1205-6da58e02b7b8.json"
)

app: App = firebase_admin.initialize_app(cred)

db = firestore.client()

# test_name: str = input(
#     "Enter the name of the test with no spaces or special characters other than '-': "
# )

# if test_name == "":
#     raise RuntimeError

test_name = "cms_sd_hotfire_1_hf"

parsed_datasets: dict[
    str,
    daq.AnalogChannelData | daq.DigitalChannelData | daq.SensorNetData | list[float],
] = daq.parseTDMS(
    5,
    1713579651000,
    file_path_custom="C:\\Users\\rajan\\Desktop\\PSP_Data\\sd_hotfire\\DataLog_2024-0419-2120-51_CMS_Data_Wiring_5.tdms",
)
parsed_datasets.update(
    daq.parseTDMS(
        6,
        1713579651000,
        file_path_custom="C:\\Users\\rajan\\Desktop\\PSP_Data\\sd_hotfire\\DataLog_2024-0419-2120-51_CMS_Data_Wiring_6.tdms",
    )
)

# sensornet_datasets = daq.parseCSV(1713579651,file_path_custom="C:/Users/rajan/Desktop/PSP_Data/sd_hotfire/reduced_sensornet_data.csv")

dict_to_write: dict[str, list[float]] = {}

all_time: list[float] = parsed_datasets["time"]

available_datasets: list[str] = []

for dataset in parsed_datasets:
# dataset = "pt-fu-02"
    if dataset != "time":
        data: list[float] = parsed_datasets[dataset].data.tolist()
        time: list[float] = all_time[: len(data)]
        df = pd.DataFrame.from_dict({"time": time, "data": data})
        df_cut = df.head(20*1000)
        thing = df_cut.iloc[::10, :]
        # print("writing csv...")
        # df.to_csv(dataset+".csv", lineterminator="\n",index=False)
        # print("compressing...")
        # c_time = gc.ValuesEncoder.encode_all(all_time)
        # c_data = gc.ValuesEncoder.encode_all(data)


        scale = "psi"
        if "tc" in dataset:
            scale = "deg"
        if "pi-" in dataset or "reed-" in dataset:
            scale = "bin"
        if "fms" in dataset:
            scale = "lbf"
        if "rtd" in dataset:
            scale = "V"
        doc_ref = db.collection(test_name).document(dataset)
        doc_ref.set({"time_offset": (time[0])})
        doc_ref.set(
            {
                "data": thing["data"].to_list(),
                "time": thing["time"].to_list(),
                "unit": scale,
            },
            merge=True,
        )
        available_datasets.append(dataset)
        print(dataset)
        # print(dataset)

doc_ref = db.collection(test_name).document("general")
doc_ref.set({"datasets": available_datasets, "test_article": "CMS", "gse_article":"BCLS", "name": "[Autosequence Data] Hotfire 1 (2s)"}, merge=True)

# for sensornet_data in sensornet_datasets:
#     dict_to_write.update({
#             sensornet_data + "__time": sensornet_datasets[sensornet_data].time,
#             sensornet_data: sensornet_datasets[sensornet_data].data
#         })


# df = pd.DataFrame(dict([ (k,pd.Series(v)) for k,v in dict_to_write.items() ]))

# df.to_csv("compiled.csv", index=False)
# df.to_json("compiled.json", orient="records", lines=True)
