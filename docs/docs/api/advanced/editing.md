---
sidebar_position: 1
---

# Editing


This repo is structured as a monorepo, with all firebase definitions and apps/services located at the root directory.

Follow [Azure Functions local debugging](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-python?pivots=python-mode-decorators#start-the-emulator) and [Firebase Functions local testing](https://firebase.google.com/docs/functions/get-started?gen=2nd#emulate-execution-of-your-functions) steps (note that all intialization beyond signing in with an authorized account has been completed, and should not be re-run)


Required tooling:

- Azure Functions (API):
  - [Python 3.11 or later](https://www.python.org/downloads/)
  - The [Azure Functions VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  - [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases)
- Firebase Functions (test creation):
  - [Firebase CLI](https://firebase.google.com/docs/cli/)
  - [Python 3.11 or later](https://www.python.org/downloads/)
