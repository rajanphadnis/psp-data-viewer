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

## Debugging Azure Functions

Tools needed:
- [Python 3.11 or later](https://www.python.org/downloads/)
- The [Azure Functions VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases)

In the `azure_functions` folder, simply attach the python debugger to the functions process by clicking "debug" in the VSCode debugging panel.

### Troubleshooting

If azure functions local debugging isn't working (can't determine functions language), you'll likely need to add a file `azure_functions/local.settings.json` with the following contents:

```json
{
    "IsEncrypted": false,
    "Values": {
        "FUNCTIONS_WORKER_RUNTIME": "python"
    }
}
```
