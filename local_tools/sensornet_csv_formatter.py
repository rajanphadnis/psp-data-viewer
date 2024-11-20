from datetime import datetime
import pandas as pd
from classes import SensorMapping


df = pd.read_csv("sensornet_data_delta_cf.csv")

def valTime(data):
    test_date = data.split("+")[0]
    if (len(test_date) == 19):
        test_date = test_date + ".000000"
    return datetime.strptime(test_date, "%Y-%m-%d %H:%M:%S.%f")

sensor_mappings = [
    SensorMapping(id=2, name="Oxygen_TC", slope=0.0078125, offset=0),
    SensorMapping(id=4, name="Fuel_TC", slope=0.0078125, offset=0),
    SensorMapping(id=6, name="Fuel_PT", slope=0.00015812, offset=0.816927241),
    SensorMapping(id=7, name="Oxygen_PT", slope=0.000160927, offset=0.81),
    SensorMapping(id=8, name="Helium_PT", slope=1, offset=0),
    SensorMapping(id=16, name="Bang_Bang_Fuel_State", slope=1, offset=0),
    SensorMapping(id=17, name="Bang_Bang_Oxygen_State", slope=1, offset=0),
    SensorMapping(
        id=19, name="Fuel_Upper_Setpoint", slope=0.00015812, offset=0.816927241
    ),
    SensorMapping(
        id=20, name="Fuel_Lower_Setpoint", slope=0.00015812, offset=0.816927241
    ),
    SensorMapping(id=21, name="Oxygen_Upper_Setpoint", slope=0.000160927, offset=0.81),
    SensorMapping(id=22, name="Oxygen_Lower_Setpoint", slope=0.000160927, offset=0.81),
]

master_df = pd.DataFrame()

for sensor in sensor_mappings:
    specific = df.loc[df["id"] == sensor.id].copy(deep=True)
    specific["value"] = (specific["value"] * sensor.slope) + sensor.offset
    specific = specific.drop("id", axis=1)
    specific["time"] = specific["time"].apply(lambda x: valTime(x))
    specific = specific.rename(columns={"time": f"{sensor.name}_time", "value": sensor.name})
    specific.to_csv(f"./out/{sensor.name}.csv", index=False)


print("thing")
