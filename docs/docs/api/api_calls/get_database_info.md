---
sidebar_position: 2
---

# get_database_info()

Call with `get_database_info()` by submitting a request to `https://psp-api.rajanphadnis.com/api/get_database_info`

Sample Query:

```
https://psp-api.rajanphadnis.com/api/get_database_info?id=zggWCpa
```

:::tip
To call the query, see the section called ["Querying the API"](../intro#querying-the-api) on the Intro page
:::

## Parameters

### `id` (Required)

#### Type: `string`

The `id` is a seven-character test identifier. This is almost always a random series of letters and numbers (no special symbols or characters), and was originally set when the test was created in the admin console.

To find your test's `id`, go to the [Admin Console](https://psp-admin.rajanphadnis.com) and select the test you want to query, then copy the "ID" value in the center pane.

### `annotations` (Optional)

#### Type: `enum`: [`yes`, `only`, `no`]

Default value: `no`

The `annotations` parameter is an enum value to determine whether or not to return annotation data, in addition to the rest of the database metadata. Setting this value to `yes` or `only` will cause the API request to slow down significantly, but will also return key-value pairs of annotations and their associated UNIX Epoch-anchored millisecond timestamps. Setting this value to `only` will only return annotation data, and will not return other database metadata.


## Query Breakdown

### Query

Let's break down the following query:

```
https://psp-api.rajanphadnis.com/api/get_database_info?id=zggWCpa
```

`https://`: This indicates that the request is sent over the _Secure_ Hyper Text Transfer Protocol. The exact way this works isn't important, but it does mean that specific headers have to be sent to allow Cross-Origin Requests, and it means that the data attached to this request is encrypted automatically in-transit. This is all usually handled automatically when you send a request - regardless of how you send it.

`psp-api.rajanphadnis.com/api/`: This is the base URL for the API - also known as the API **endpoint**. All requests to the API start with this endpoint

`get_database_info`: This is the API function name - the "what do you want to do" part of the API. You can see all of the options for this in this documentation (see the sidebar on the left under "API Calls"). In this case, we want to get database information

`?`: This indicates that you are now starting to pass parameters to the API. It always comes _after_ the function name, and _before_ any parameters

`id=zggWCpa`: this is the `id` parameter, which in this case is `zggWCpa`. Because this is a required parameter, the function will return an HTTPS 400 Error code if the parameter is not passed ([see example](https://psp-api.rajanphadnis.com/api/get_database_info)). If the `id` value is passed, but is incorrect or includes quotes (or there's any other problem), the server will respond with an HTTPS 500 Error code ([see example](https://psp-api.rajanphadnis.com/api/get_database_info?id=zggWCp)).

### Response

Here's a condensed version of the data that's returned:

```json
{
    "function_exec_time_total_ms": 178.8766384124756,
    "database_start_time": 1714534089327,
    "database_end_time": 1714537907356,
    "database_channel_list": [
        "fms__lbf__",
        ...
        "time"
    ]
}
```

The `database_channel_list` is a JSON list of strings of all of the available channels this test has associated with it. This list includes the "time" channel, even though it is not a data channel (and rather, only includes timestamps in seconds since the UNIX Epoch)

The `database_start_time` value is the time in milliseconds since the UNIX epoch of when the test data starts. There exists no data before this timestamp belonging to this test `id`

The `database_end_time` value is the time in milliseconds since the UNIX epoch of when the test data ends. There exists no data beyond this timestamp belonging to this test `id`

The other returned value is simply a logging value: `function_exec_time_total_ms` indicates the total time the API function was running on the server. Any difference between this and the total response time you've measured locally comes from the time it takes to "spool up" the API server and download the results to you computer

## Example

### Get test metadata


```
https://psp-api.rajanphadnis.com/api/get_database_info?id=zggWCpa
```

### Get test metadata and annotations


```
https://psp-api.rajanphadnis.com/api/get_database_info?id=zggWCpa&annotations=yes
```

### Get only annotations


```
https://psp-api.rajanphadnis.com/api/get_database_info?id=zggWCpa&annotations=only
```