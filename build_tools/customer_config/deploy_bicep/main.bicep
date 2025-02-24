targetScope = 'subscription'

@minLength(3)
@maxLength(7)
@description('Provide a slug to generate names for resources to deploy')
param slug string

@minLength(18)
@maxLength(18)
@description('Provide the Stripe-generated customer ID to attach the generated resources to')
param customerID string

@description('Stripe API Key')
param stripeKey string
param location string = 'eastus'
param resourceGroupName string = 'dataviewerrg${slug}'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: resourceGroupName
  location: location
}

module resources 'resources.bicep' = {
  name: 'resourcesModule'
  scope: resourceGroup
  params: {
    slug: slug
    customerID: customerID
    stripeKey: stripeKey
  }
}
