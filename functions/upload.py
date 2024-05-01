import firebase_admin
from firebase_admin import credentials, firestore, App
import psp_liquids_daq_parser as daq
import pandas as pd
import gorillacompression as gc
import matplotlib.pyplot as plt

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

test_name = "cms_whoopsie_hf_hf"

parsed_datasets: dict[
    str,
    daq.AnalogChannelData | daq.DigitalChannelData | daq.SensorNetData | list[float],
] = daq.parseTDMS(
    5,
    1714536122000,
    file_path_custom="C:\\Users\\rajan\\Desktop\\PSP_Data\\whoopsie\\DataLog_2024-0501-0002-02_CMS_Data_Wiring_5.tdms",
)
parsed_datasets.update(
    daq.parseTDMS(
        6,
        1714536122000,
        file_path_custom="C:\\Users\\rajan\\Desktop\\PSP_Data\\whoopsie\\DataLog_2024-0501-0002-02_CMS_Data_Wiring_6.tdms",
    )
)

dict_to_write: dict[str, list[float]] = {}

all_time: list[float] = parsed_datasets["time"]

available_datasets: list[str] = []

# parsed_datasets = daq.parseCSV(1714536122000, file_path_custom="C:\\Users\\rajan\\Desktop\\PSP_Data\\whoopsie\\reduced_sensornet_data.csv")


for dataset in parsed_datasets:
# dataset = "pt-fu-02"
    if dataset != "time":
        data: list[float] = parsed_datasets[dataset].data.tolist()
        # time: list[float] = parsed_datasets[dataset].time.tolist()
        time: list[float] = all_time[: len(data)]
        df = pd.DataFrame.from_dict({"time": time, "data": data})
        df_cut = df.head(15*1000)
        thing = df_cut.iloc[::4, :]
        # print("writing csv...")
        # df.to_csv(dataset+".csv", lineterminator="\n",index=False)
        # print("compressing...")
        # c_time = gc.ValuesEncoder.encode_all(all_time)
        # c_data = gc.ValuesEncoder.encode_all(data)


        scale = "psi"
        if "tc" in dataset:
            scale = "deg"
        if "pi-" in dataset or "reed-" in dataset or "_state" in dataset:
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

# doc_ref = db.collection(test_name).document("general")
# doc_ref.set({"datasets": available_datasets, "test_article": "CMS", "gse_article":"BCLS", "name": "[HF:HF] Whoopsie"}, merge=True)


