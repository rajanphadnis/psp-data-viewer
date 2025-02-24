param slug string
param customerID string
param stripeKey string
param location string = 'eastus'
param functionAppName string = 'dataviewer-api-${slug}'
param storageSKU string = 'Standard_LRS'
param pythonVersion string = '3.11'
param share string = 'dataviewer-fileshare-${slug}'
param mountPath string = '/hdf5data'
param storageAccountName string = 'dataviewerstor${slug}'
param deploymentStorageContainerName string = 'dataviewercont${slug}'
param storageRoleDefinitionId string = 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'

resource hostingPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: functionAppName
  location: location
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
    size: 'FC1'
    family: 'FC'
    capacity: 0
  }
  kind: 'functionapp'
  properties: {
    reserved: true
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageSKU
  }
  kind: 'StorageV2'
  properties: {
    defaultToOAuthAuthentication: true
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
    accessTier: 'Cool'
  }
  resource storageAccountBlobService 'blobServices@2023-05-01' = {
    name: 'default'
    properties: {
      deleteRetentionPolicy: {
        allowPermanentDelete: false
        enabled: false
      }
    }
    resource storageAccountBlobContainer 'containers@2023-05-01' = {
      name: deploymentStorageContainerName
      properties: {
        immutableStorageWithVersioning: {
          enabled: false
        }
        publicAccess: 'None'
      }
    }
  }
  resource storageAccountFileService 'fileServices@2023-05-01' = {
    name: 'default'
    properties: {
      protocolSettings: {
        smb: {}
      }
      cors: {
        corsRules: []
      }
      shareDeleteRetentionPolicy: {
        enabled: false
      }
    }
    resource storageAccountFileShare 'shares@2023-05-01' = {
      name: share
      properties: {
        accessTier: 'Cool'
        shareQuota: 102400
        enabledProtocols: 'SMB'
      }
    }
  }
}

resource functions 'Microsoft.Web/sites@2024-04-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    reserved: true
    siteConfig: {
      numberOfWorkers: 1
      acrUseManagedIdentityCreds: false
      alwaysOn: false
      http20Enabled: false
      functionAppScaleLimit: 100
      minimumElasticInstanceCount: 0
      cors: {
        allowedOrigins: ['*']
      }
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: storageAccount.name
        }
        {
          name: 'STRIPE_API_KEY'
          value: stripeKey
        }
        {
          name: 'STRIPE_CUSTOMER_ID'
          value: customerID
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~1'
        }
      ]
    }
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobcontainer'
          value: '${storageAccount.properties.primaryEndpoints.blob}${deploymentStorageContainerName}'
          authentication: {
            type: 'SystemAssignedIdentity'
          }
        }
      }
      runtime: {
        name: 'python'
        version: '3.11'
      }
      scaleAndConcurrency: {
        alwaysReady: [
          {
            name: 'http'
            instanceCount: 2
          }
        ]
        maximumInstanceCount: 150
        instanceMemoryMB: 2048
        triggers: {}
      }
    }
    publicNetworkAccess: 'Enabled'
  }
  resource functionAppName_OneDeploy 'extensions@2024-04-01' = {
    name: 'onedeploy'
    properties: {
      packageUri: 'https://dataviewer.space/released-package.zip'
      remoteBuild: true
    }
  }
  resource functionConfig 'config@2024-04-01' = {
    name: 'web'
    properties: {
      pythonVersion: pythonVersion
      alwaysOn: false
      publicNetworkAccess: 'Enabled'
      cors: {
        allowedOrigins: [
          '*'
        ]
        supportCredentials: false
      }
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      preWarmedInstanceCount: 0
      functionAppScaleLimit: 100
      minimumElasticInstanceCount: 0
      azureStorageAccounts: {
        '${storageAccount::storageAccountFileService::storageAccountFileShare.name}': {
          type: 'AzureFiles'
          accountName: storageAccount.name
          shareName: storageAccount::storageAccountFileService::storageAccountFileShare.name
          mountPath: mountPath
          protocol: 'Smb'
          accessKey: storageAccount.listKeys().keys[0].value
        }
      }
    }
  }
}

resource storageRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccount.id, storageRoleDefinitionId)
  scope: storageAccount
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', storageRoleDefinitionId)
    principalId: functions.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
