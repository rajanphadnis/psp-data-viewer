from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS
import pandas as pd
import csv

# InfluxDB connection parameters
url = "http://localhost:8086"
token = "super-secret-influx-token"
org = "psp-liquids"
bucket = "sensornet"

sensor_ids = [6, 7, 16, 17]

# Path to save CSV file
csv_file_path = "sensornet_data.csv"

# Initialize InfluxDB client
client = InfluxDBClient(url=url, token=token, org=org)

def query(start,end):
  # Query data
  query = f'''
  from(bucket: "sensornet")
    |> range(start: {start}, stop: {end})
    |> filter(fn: (r) => r["_measurement"] == "sensor")
    |> filter(fn: (r) => r["_field"] == "data")
    |> filter(fn: (r) => r["id"] == "17" or r["id"] == "16" or r["id"] == "6" or r["id"] == "7")
    |> keep(columns: ["_time", "_value", "id"])
    |> yield()
  '''
  # Get query client
  query_api = client.query_api()

  # Execute query
  result = query_api.query(org=org, query=query)

  # Write data to CSV file
  with open(csv_file_path, mode='w', newline='') as file:
      writer = csv.writer(file)
      writer.writerow(["time", "value", "id"])
      for table in result:
          for record in table.records:
              writer.writerow([record.get_time(), record.get_value(), record.values.get("id")])

query("2024-04-30T23:28:50-04:00","2024-05-01T00:03:30-04:00")

result = pd.read_csv('sensornet_data.csv')

start_time = pd.Timestamp(result['time'].min())
result['time'] = (pd.to_datetime(result['time'])- start_time).dt.total_seconds()

temp_df = pd.DataFrame()
for id in sensor_ids:
    bruh = pd.DataFrame({
        f'{id}_time': result[result['id'] == id]['time'].values,
        f'{id}_data': result[result['id'] == id]['value'].values
    })
    temp_df = pd.concat([temp_df, bruh], axis=1)

# Calibrations
temp_df['6_data'] = temp_df['6_data'].apply(lambda x: 0.000158971906284*x + 0.25)
temp_df['7_data'] = temp_df['7_data'].apply(lambda x: 0.000159981337721*x + 0.5)

temp_df.to_csv('reduced_sensornet_data.csv', index=False)

print(f"Data successfully downloaded, reduced, and saved to reduced_sensornet_data.csv")