param functionAppName string

resource functionAppName_OneDeploy 'Microsoft.Web/sites/extensions@2024-04-01' = {
  name: '${functionAppName}/onedeploy'
  properties: {
    packageUri: 'https://dataviewer.space/released-package.zip'
    remoteBuild: true
  }
}
