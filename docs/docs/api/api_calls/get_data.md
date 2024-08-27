---
sidebar_position: 1
---

# get_data()

Call with `get_data()` by submitting a request to `https://psp-api.rajanphadnis.com/api/get_data`

Sample Query: `https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&start=1714534081000&end=1714537899029&channels=fms__lbf__,rtd-fu__V__`

## Parameters

### `id` (Required)
#### Type: `string`

The `id` is a seven-character test identifier. This is almost always a random series of letters and numbers (no special symbols or characters), and was originally set when the test was created in the admin console.

To find your test's `id`, go to the [Admin Console](https://psp-admin.rajanphadnis.com) and select the test you want to query, then copy the "ID" value in the center pane.

### `start` (Optional)
#### Type: `int`

Default value: start of test data

Time in milliseconds since the UNIX Epoch, converted to UTC time. Must be greater than the "Start Time" of the test you're requesting data for. Must be less than the `end` parameter, if provided. Get start time by calling `get_database_info()` as described [here](./get_database_info).

Example: `1714536089856` is the same as `Wednesday, May 1, 2024 4:01:29.856 AM UTC-0`

You can get this value pretty easily by inputting your date into [a website like this one](https://www.epochconverter.com/), or getting a datetime object in Python and converting it in a script like so:
```python3.11
from time import time
 
milliseconds = int(time() * 1000)
 
print("Time in milliseconds since epoch", milliseconds)
```

### `end` (Optional)
#### Type: `int`

Default value: end of test data

Time in milliseconds since the UNIX Epoch, converted to UTC time. Must be less than the "End Time" of the test you're requesting data for. Must be greater than the `start` parameter, if provided. Get end time by calling `get_database_info()` as described [here](./get_database_info).

Example: `1714536089856` is the same as `Wednesday, May 1, 2024 4:01:29.856 AM UTC-0`

You can get this value pretty easily by inputting your date into [a website like this one](https://www.epochconverter.com/), or getting a datetime object in Python and converting it in a script like so:
```python3.11
from time import time
 
milliseconds = int(time() * 1000)
 
print("Time in milliseconds since epoch", milliseconds)
```

### `channels` (Optional)
#### Type: list of type `string`.

Default value: "time"

Values separated by commas, no spaces. Each channel is formatted as such: `*channel_name*` + `__` + `units` + `__`, so the channel name for the fms (Force Measurement System) is as follows (assuming the channel name is `fms` and the units are `lbf`): `fms__lbf__`

Regardless of which channels you request, assuming the channels exist, the `time` channel will always be returned.

### `max` (Optional)
#### Type: `int`

Default value: 4500

Number of evenly-spaced samples to retreive. The lower this number, the fewer number of samples per channel you'll get (more coarse data). The larger the number, the finer the data resolution.

:::warning
Please keep data bandwidth and throughput costs in mind when changing this value. Often, you'll be able to get really fine data for shorter periods of time, and good coarse data for longer periods of time - which is what you'll want. The more data returned, the longer the response will take, and the more compute will be used up processing the data points, and the more noise cleaning you'll have to do once you get the data.
:::

## Query Breakdown

Let's break down the following query: `https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&start=1714536089856&end=1714536171578&channels=fms__lbf__,fu_psi__psi__,rtd-fu__V__,rtd-ox__V__&max=20`

Here's a condensed version of the data that's returned:

```json
{
    "fms__lbf__": [
        50.55506672985416,
        ...
        -112.81426404518486
    ],
    "fu_psi__psi__": [
        15.05076139075925,
        ...
        0.344747256145264
    ],
    "rtd-fu__V__": [
        2.520059216978288,
        ...
        2.539796878344761
    ],
    "rtd-ox__V__": [
        2.662828256851203,
        ...
        2.6222015933914937
    ],
    "time": [
        1714536089.857,
        ...
        1714536167.53
    ],
    "function_exec_time_total_ms": 3119.910955429077,
    "function_exec_time_fetch_ms": 3093.1169986724854,
    "function_exec_time_filter_ms": 23.9410400390625,
    "function_exec_time_package_ms": 2.852916717529297,
    "entries_per_dataset_returned": 20
}
```

## Examples

### Get data from a single channel