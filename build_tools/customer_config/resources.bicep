param slug string
param customerID string
param location string = 'eastus'
param functionAppName string = 'dataviewer-serverless-function-${slug}'
param storageSKU string = 'Standard_LRS'
param pythonVersion string = '3.11'
param directory string = 'hdf5_data'
param share string = 'dataviewer-fileshare-${slug}'
param shareId string = 'dataviewer-share-${slug}'
param mountPath string = '/hdf5data'
param storageAccountName string = 'dataviewerstorage${slug}'
param deploymentStorageContainerName string = 'deploymentStorageContainer-${slug}'
param containers array = [{ name: deploymentStorageContainerName }]

resource storageaccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: storageSKU
  }
  properties: {
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    // defaultToOAuthAuthentication: true
  }
  resource blobServices 'blobServices' = if (!empty(containers)) {
    name: 'default'
    properties: {
      deleteRetentionPolicy: {
        enabled: false
      }
    }
    resource container 'containers' = [
      for container in containers: {
        name: container.name
        properties: {
          publicAccess: container.?publicAccess ?? 'None'
        }
      }
    ]
  }
}

resource flexFuncPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  dependsOn: storageaccount
  name: functionAppName
  location: location
  kind: 'functionapp'
  sku: {
    tier: 'FlexConsumption'
    name: 'FC1'
  }
  properties: {
    reserved: true
  }
}

resource flexFuncApp 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: flexFuncPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage__accountName'
          value: storageaccount.name
        }
      ]
    }
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${storageaccount.properties.primaryEndpoints.blob}${deploymentStorageContainerName}'
          authentication: {
            type: 'SystemAssignedIdentity'
          }
        }
      }
      scaleAndConcurrency: {
        maximumInstanceCount: 100
        instanceMemoryMB: 2048
      }
      runtime: {
        name: 'python'
        version: pythonVersion
      }
    }
  }
}


resource functionAppName_OneDeploy 'Microsoft.Web/sites/extensions@2022-09-01' = {
  parent: flexFuncApp
  name: 'onedeploy'
  location: location
  properties: {
    packageUri: 
    remoteBuild: false 
  }
}
