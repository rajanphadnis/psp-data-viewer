from datetime import datetime
import pandas as pd
from classes_thing import SensorMapping


df = pd.read_csv("./data/delta_cf1/sensornet_data_delta_cf.csv")


def valTime(data):
    test_date = data.split("+")[0]
    if len(test_date) == 19:
        test_date = test_date + ".000000"
    return datetime.strptime(test_date, "%Y-%m-%d %H:%M:%S.%f")


# delta cf2
# sensor_mappings = [
#     SensorMapping(id=2, name="tc-ox-202", slope=0.0078125, offset=-26, nickname="Oxygen TC"),
#     SensorMapping(id=4, name="tc-fu-202", slope=0.0078125, offset=-34, nickname="Fuel TC"),
#     SensorMapping(id=6, name="pt-fu-201", slope=0.000158195, offset=1, nickname="Fuel PT"),
#     SensorMapping(id=7, name="pt-ox-201", slope=0.000158856, offset=0.3, nickname="Oxygen PT"),
#     SensorMapping(id=8, name="pt-he-201", slope=1, offset=0, nickname="Helium PT"),
#     SensorMapping(id=16, name="sv-he-202_state", slope=1, offset=0, nickname="Bang_Bang_Fuel_State"),
#     SensorMapping(id=17, name="sv-he-201_state", slope=1, offset=0, nickname="Bang_Bang_Oxygen_State"),
#     SensorMapping(
#         id=19, name="pt-fu-201_setpoint_high", slope=0.000158195, offset=1, nickname="Fuel_Upper_Setpoint"
#     ),
#     SensorMapping(
#         id=20, name="pt-fu-201_setpoint_low", slope=0.000158195, offset=1, nickname="Fuel_Lower_Setpoint"
#     ),
#     SensorMapping(id=21, name="pt-ox-201_setpoint_high", slope=0.000158856, offset=0.3, nickname="Oxygen_Upper_Setpoint"),
#     SensorMapping(id=22, name="pt-ox-201_setpoint_low", slope=0.000158856, offset=0.3, nickname="Oxygen_Lower_Setpoint"),
# ]


# delta cf1
sensor_mappings = [
    SensorMapping(
        id=2, name="tc-ox-202", slope=0.0078125, offset=0, nickname="Oxygen_TC"
    ),
    SensorMapping(
        id=4, name="tc-fu-202", slope=0.0078125, offset=0, nickname="Fuel_TC"
    ),
    SensorMapping(
        id=6, name="pt-fu-201", slope=0.00015812, offset=0.816927241, nickname="Fuel_PT"
    ),
    SensorMapping(
        id=7, name="pt-ox-201", slope=0.000160927, offset=0.81, nickname="Oxygen_PT"
    ),
    # SensorMapping(id=8, name="pt-he-201", slope=1, offset=0, nickname="Helium_PT"),
    SensorMapping(
        id=16,
        name="sv-he-202_state",
        slope=1,
        offset=0,
        nickname="Bang_Bang_Fuel_State",
    ),
    SensorMapping(
        id=17,
        name="sv-he-201_state",
        slope=1,
        offset=0,
        nickname="Bang_Bang_Oxygen_State",
    ),
    SensorMapping(
        id=19,
        name="pt-fu-201_setpoint_high",
        slope=0.00015812,
        offset=0.816927241,
        nickname="Fuel_Upper_Setpoint",
    ),
    SensorMapping(
        id=20,
        name="pt-fu-201_setpoint_low",
        slope=0.00015812,
        offset=0.816927241,
        nickname="Fuel_Lower_Setpoint",
    ),
    SensorMapping(
        id=21,
        name="pt-ox-201_setpoint_high",
        slope=0.000160927,
        offset=0.81,
        nickname="Oxygen_Upper_Setpoint",
    ),
    SensorMapping(
        id=22,
        name="pt-ox-201_setpoint_low",
        slope=0.000160927,
        offset=0.81,
        nickname="Oxygen_Lower_Setpoint",
    ),
]

master_df = pd.DataFrame()

for sensor in sensor_mappings:
    specific = df.loc[df["id"] == sensor.id].copy(deep=True)
    specific["value"] = (specific["value"] * sensor.slope) + sensor.offset
    specific = specific.drop("id", axis=1)
    specific["time"] = specific["time"].apply(lambda x: valTime(x))
    specific = specific.rename(
        columns={"time": f"{sensor.name}_time", "value": sensor.name}
    )
    specific.to_csv(f"./out/{sensor.name}.csv", index=False)


print("thing")
