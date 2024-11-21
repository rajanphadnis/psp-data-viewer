from datetime import datetime, timedelta
import pandas as pd
from classes_thing import SensorMapping


df = pd.read_csv("./data/sensornet_data_delta_cf_2_out.csv")

def valTime(data):
    test_date = data.split("-05:00")[0]
    if (len(test_date) == 19):
        test_date = test_date + ".000000"
    dt = datetime.strptime(test_date, "%Y-%m-%d %H:%M:%S.%f")
    dt = dt + timedelta(hours=5)
    return dt


def bool_to_int(data):
    if (data is False):
        return 0
    else:
        return 1

sensor_mappings = [
    SensorMapping(id=2, name="tc-ox-202", slope=0.0078125, offset=-26, nickname="Oxygen TC"),
    SensorMapping(id=4, name="tc-fu-202", slope=0.0078125, offset=-34, nickname="Fuel TC"),
    SensorMapping(id=6, name="pt-fu-201", slope=0.000158195, offset=1, nickname="Fuel PT"),
    SensorMapping(id=7, name="pt-ox-201", slope=0.000158856, offset=0.3, nickname="Oxygen PT"),
    SensorMapping(id=8, name="pt-he-201", slope=1, offset=0, nickname="Helium PT"),
    SensorMapping(id=16, name="sv-he-202", slope=1, offset=0, nickname="Bang_Bang_Fuel_State"),
    SensorMapping(id=17, name="sv-he-201", slope=1, offset=0, nickname="Bang_Bang_Oxygen_State"),
    SensorMapping(
        id=19, name="pt-fu-201_setpoint_high", slope=0.000158195, offset=1, nickname="Fuel_Upper_Setpoint"
    ),
    SensorMapping(
        id=20, name="pt-fu-201_setpoint_low", slope=0.000158195, offset=1, nickname="Fuel_Lower_Setpoint"
    ),
    SensorMapping(id=21, name="pt-ox-201_setpoint_high", slope=0.000158856, offset=0.3, nickname="Oxygen_Upper_Setpoint"),
    SensorMapping(id=22, name="pt-ox-201_setpoint_low", slope=0.000158856, offset=0.3, nickname="Oxygen_Lower_Setpoint"),
]

df["time"] = df["time"].apply(lambda x: valTime(x))
df["Bang_Bang_Fuel"] = df["Bang_Bang_Fuel"].apply(lambda x: bool_to_int(x))
df["Bang_Bang_Oxygen"] = df["Bang_Bang_Oxygen"].apply(lambda x: bool_to_int(x))

df1 = df[["time", "Fuel_psi"]].copy()
df1.columns = ["pt-fu-201_time", "pt-fu-201"]
df2 = df[["time", "Oxygen_psi"]].copy()
df2.columns = ["pt-ox-201_time", "pt-ox-201"]
df3 = df[["time", "Bang_Bang_Fuel"]].copy()
df3.columns = ["sv-he-202_state_time", "sv-he-202_state"]
df4 = df[["time", "Bang_Bang_Oxygen"]].copy()
df4.columns = ["sv-he-201_state_time", "sv-he-201_state"]

result = pd.concat([df1, df2, df3, df4], axis=1)

result.to_csv("./out/reduced.csv", index=False)

