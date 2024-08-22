---
sidebar_position: 2
---

# Azure Resources

## Azure Functions

Platform stack: `Python 3.11` running on a `linux` base image

Region: `east-us`

Billing Plan: `Consumption` (max instances: `200`, event-driven instance scaling)


## Azure File Share

File share is mounted to `/hdf5data` within the Azure Functions instance

Important file structure is as follows:

```
/
|
+ - hdf5_data/
  |
  + {test_id}.hdf5

```

