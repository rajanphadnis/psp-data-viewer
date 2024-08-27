---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Intro

There are two ways to use this platform: the API or the [GUI](https://psp.rajanphadnis.com/). I tried to make both as easy to use as possible, but since they have different purposes, the API will be a harder-to-use tool than the GUI, but is more powerful than the GUI, and can be easily weaved into client-side scripts

:::important
The API is read-only. The [admin console](https://psp-admin.rajanphadnis.com/) is the only way to manage and write platform data.
:::

The API (Application Programming Interface) is a quick way to access test data via simple GET requests. See the other docs on this site for more info, but here's a couple quick sample endpoints you can query for some basic data:

Get data for channels `fms__lbf__` and `rtd-ox__V__` (automatically selected entire test period and downsampled):

```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__
```

Get data for channels `fms__lbf__`, `fu_psi__psi__`, `rtd-fu__V__` and `rtd-ox__V__` for a small time period of the actual test (actual hotfire):
```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&start=1714536089856&end=1714536171578&channels=fms__lbf__,fu_psi__psi__,rtd-fu__V__,rtd-ox__V__
```

The [documentation](https://psp-docs.rajanphadnis.com/docs/api/api_calls/get_data) for the `get_data()` API endpoint has better examples and more information on how to construct these URLs.

Metadata about the test you're trying to access can be found by navigating to the [admin dashboard](https://psp-admin.rajanphadnis.com/) and selecting the test you're interested in on the top-left pane.

Another less-commonly-used API endpoint is the `get_database_info()` endpoint, which returns a list of the available channels in the dataset, as well as the starting and ending timestamps of the test (in milliseconds since UNIX epoch)

```
https://psp-api.rajanphadnis.com/api/get_database_info?id=zggWCpa
```

## Querying the API

To query the API (to "call" the function and get data back), all you have to do is send a GET request to a specific URL, and the results will be returned to you in JSON!

After forming your query using the documentation for a specific endpoint ([`get_data()`, for example](./api_calls/get_data)), you'll end up with a URL that starts with `https://psp-api.rajanphadnis.com/api/`

For this example, let's use the following URL: `https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__`.

To request data from this URL, you can just visit the URL in a web browser ([Try It!](https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__)) and save the resulting webpage as a JSON file (Ctrl+S or Cmd+S).

HOWEVER, that's pretty cumbersome and doesn't play very nice with other programming languages. Instead, here are some better ways to access the data:

<Tabs>
  <TabItem value="win" label="Windows" default>
    Using Command Prompt:
    ```
    curl "https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__" > response.json
    ```
    Using Windows Powershell:
    ```
    Invoke-WebRequest -Uri "https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__" | ConvertFrom-Json | ConvertTo-Json | Set-Content -Path "response.json"
    ```
    This will write the data from the API to a file called "response.json" in whatever folder you have open in the command prompt
  </TabItem>
  <TabItem value="unix" label="MacOS/Linux">
    In a terminal window, paste the following command:
    ```
    curl "https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__" > response.json
    ```
    This will write the data from the API to a file called "response.json" in whatever folder you have open in the terminal
  </TabItem>
  <TabItem value="python" label="Python">
    First, you'll have to install a standard package called "requests":
    ```bash
    pip install requests
    ```
    Then, in your script, import the `requests` package at the top of your script, and call the `requests.get()` method:

    ```python3.12
    import requests
    ...
    # All of your other code goes here
    ...
    response = requests.get(
        "https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__"
    ).json()
    ```

    Now you can reference the `response` variable as if it were a dictionary of data:
    ```python3.12
    number_of_entries = response["entries_per_dataset_returned"]
    fms_data = response["fms__lbf__"]
    time_data = response["time]
    ```
  </TabItem>
  <TabItem value="matlab" label="MATLAB">
    May god have mercy on your soul
    
    [Here's a link to their documentation](https://www.mathworks.com/help/matlab/ref/webread.html) on how to interact with RESTful APIs. the URL you'll use is:
    ```
    https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&channels=fms__lbf__,rtd-ox__V__
    ```
  </TabItem>
</Tabs>

