---
sidebar_position: 1
---

# get_data()

Call with `get_data()` by submitting a request to `https://psp-api.rajanphadnis.com/api/get_data`

Sample Query: 
```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&start=1714534081000&end=1714537899029&channels=fms__lbf__,rtd-fu__V__
```

:::tip
To call the query, see the section called ["Querying the API"](../intro#querying-the-api) on the Intro page
:::

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

### Query

Let's break down the following query:

```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&start=1714536089856&end=1714536171578&channels=fms__lbf__,fu_psi__psi__,rtd-fu__V__,rtd-ox__V__&max=20
```

`https://`: This indicates that the request is sent over the _Secure_ Hyper Text Transfer Protocol. The exact way this works isn't important, but it does mean that specific headers have to be sent to allow Cross-Origin Requests, and it means that the data attached to this request is encrypted automatically in-transit. This is all usually handled automatically when you send a request - regardless of how you send it.

`psp-api.rajanphadnis.com/api/`: This is the base URL for the API - also known as the API **endpoint**. All requests to the API start with this endpoint

`get_data`: This is the API function name - the "what do you want to do" part of the API. You can see all of the options for this in this documentation (see the sidebar on the left under "API Calls"). In this case, we want to get data from the database

`?`: This indicates that you are now starting to pass parameters to the API. It always comes _after_ the function name, and _before_ any parameters

`id=zggWCpa`: this is the `id` parameter, which in this case is `zggWCpa`. Because this is a required parameter, the function will return an HTTPS 400 Error code if the parameter is not passed ([see example](https://psp-api.rajanphadnis.com/api/get_data?start=1714536089856&end=1714536171578&channels=fms__lbf__,fu_psi__psi__,rtd-fu__V__,rtd-ox__V__&max=20)). If the `id` value is passed, but is incorrect or includes quotes (or there's any other problem), the server will respond with an HTTPS 500 Error code ([see example](https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpstart=1714536089856&end=1714536171578&channels=fms__lbf__,fu_psi__psi__,rtd-fu__V__,rtd-ox__V__&max=20)).

`&`: This indicates that you're passing another parameter to the API. This must be used in between each parameter's name and the previous paramater's value to separate the parameters.

`start=1714536089856`: this is the `start` parameter, with a value of `1714536089856`, which is the same as `Wednesday, May 1, 2024 4:01:29.856 AM` (you can use [this website](https://www.epochconverter.com/) to quickly convert between milliseconds and timestamps)

`end=1714536171578`: this is the `end` parameter, with a value of `1714536171578`, which is the same as `Wednesday, May 1, 2024 4:02:51.578 AM` (you can use [this website](https://www.epochconverter.com/) to quickly convert between milliseconds and timestamps)

`channels=fms__lbf__,fu_psi__psi__,rtd-fu__V__,rtd-ox__V__`: This is the `channels` parameter. If this is missing or empty, only the `time` data will be returned. The value of this parameter is a comma-separated list of channels you'd like to get (with no spaces)

`max=20`: This is the `max` parameter. If this is missing or empty (as it should be for most requests), the default value is 4500 data points per channel. In this case, we're requesting only 20 data points per channel - which means we'll receive (4+1)\*20=100 data points total (4 channels, each with 20 data points and one "time" channel with 20 timestamps in seconds)

### Response

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

As you can see, in addition to the channels that were requested, the `time` channel was also returned. The `time` values are formatted as UNIX timestamps (type: list of `float`), but in **seconds** since UNIX Epoch, **not milliseconds**.

The `entries_per_dataset_returned` value indicates how many data points were returned for each channel. This has a maximum of the `max` value, but can be less than the `max` value, depending on the time period selected.

The other returned values are simply logging values:

- `function_exec_time_total_ms` indicates the total time the API function was running on the server. Any difference between this and the total response time you've measured locally comes from the time it takes to "spool up" the API server and download the results to you computer

  - This is also the sum of `function_exec_time_fetch_ms` + `function_exec_time_filter_ms` + `function_exec_time_package_ms`

- `function_exec_time_fetch_ms` indicates the amount of time the API function was fetching the HDF5 database

- `function_exec_time_filter_ms` indicates the amount of time the API function was filtering down the database and subsampling to match your query

- `function_exec_time_package_ms` indicates the amount of time the API function was converting the filtered database into JSON and packaging it into a web response format to send to your computer

## Examples

### Get data from a single channel

Time period: entire test period

max: default (4500)

```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__
```

### Get data from multiple channels

Time period: entire test period

max: default (4500)

```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-fu__V__
```

### Get data from multiple channels with a limited time period

Time period: 1714536089856 --> 1714536171578

max: default (4500)

```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-fu__V__&start=1714536089856&end=1714536171578
```

### Get data from multiple channels with a limited time period and high fidelity

Time period: 1714536089856 --> 1714536171578

max: 10000

```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-fu__V__&start=1714536089856&end=1714536171578&max=10000
```
