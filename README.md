# PSP Data Viewer Platform

[![[CD:Production] Build and Release](https://github.com/rajanphadnis/psp-data-viewer/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/rajanphadnis/psp-data-viewer/actions/workflows/deploy.yml)

Webapp: https://psp.rajanphadnis.com/

Admin Console: https://psp-admin.rajanphadnis.com/

Documentation: https://psp-docs.rajanphadnis.com/


# Using the platform

There are two ways to use this tool: the API or the [GUI](https://psp.rajanphadnis.com/). I tried to make both as easy to use as possible, but since they have different purposes, the API will be a harder-to-use tool than the GUI.

The [admin console](https://psp-admin.rajanphadnis.com/) is the only way to manage and write platform data.

For all other questions or confuzzlements, please consult the platform [documentation](https://psp-docs.rajanphadnis.com/)

## The API

The API (Application Programming Interface) is a quick way to access test data via simple GET requests. See the [documentation](https://psp-docs.rajanphadnis.com/docs/api/api_calls/get_data) for more info, but here's a couple quick sample endpoints you can query for some basic data:

Get data for channels `fms__lbf__` and `rtd-ox__V__`:

```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&start=1714534081000&end=1714537899029&channels=fms__lbf__,rtd-ox__V__
```

Get data for channels `fms__lbf__`, `fu_psi__psi__`, `rtd-fu__V__` and `rtd-ox__V__` for a small time period of the actual test (actual hotfire):
```
https://psp-api.rajanphadnis.com/api/get_data?id=zggWCpa&start=1714536089856&end=1714536171578&channels=fms__lbf__,fu_psi__psi__,rtd-fu__V__,rtd-ox__V__
```

The [documentation](https://psp-docs.rajanphadnis.com/docs/api/api_calls/get_data) for the `get_data()` API endpoint has better examples and more information on how to construct these URLs.

Metadata about the test you're trying to access can be found by navigating to the [admin dashboard](https://psp-admin.rajanphadnis.com/) and selecting the test you're interested in on the top-left pane.

## The GUI

While relatively self-explanatory, use the [main GUI](https://psp.rajanphadnis.com/) to:
1. Select a test (when you load the page, a default test will already be selected)

2. Select channels you want to view data for (the available channel list is on the right)

3. Zoom to view more detailed data during specific parts of the test (click and drag over the area you'd like to see in more depth)

</br>

Some important notes:

1. When you first click on a channel, it may take up to 10s to display the data. After this, clicking on new channels and zooming to new areas will likely load much faster, as the API has had a chance to "warm up".

2. All data is cached within the browser as it's received for speed. To clear this cache, click the "settings" cog on the top toolbar, then click "Reset Site"

3. 

### Sharing plots and data

- Share your plots by clicking the "Share" button in the top right corner, and sending the now-copied sharelink to anyone else!
  
- You can also download an image of the plot by clicking the "download" button in the toolbar

- Copy an image of the plot to your clipboard by clicking the "copy" button in the toolbar


</br>

# Contributing
This repository is structured for small, easy contributions. If you're not looking to edit in the browser, clone the repository to your local machine and follow the instructions below.


## Tooling/Setup
Here's the tools you'll need to have on your local machine for full-featured development. Note that all tools must be fully installed and available via the command line to work properly. This usually means adding an entry to your system [`PATH`](https://stackoverflow.com/questions/9546324/adding-a-directory-to-the-path-environment-variable-in-windows)

- Web App:
  - [Firebase CLI](https://firebase.google.com/docs/cli/)
  - [bun](https://bun.sh/)
- Admin Dashboard:
  - [Firebase CLI](https://firebase.google.com/docs/cli/)
  - [bun](https://bun.sh/)
- Documentation:
  - [Node.js (v20)](https://nodejs.org/en)
- Azure Functions (API):
  - [Python 3.11 or later](https://www.python.org/downloads/)
  - The [Azure Functions VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  - [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases)
- Firebase Functions (test creation):
  - [Firebase CLI](https://firebase.google.com/docs/cli/)
  - [Python 3.11 or later](https://www.python.org/downloads/)

## Making Changes

This repo is structured as a monorepo, with all firebase definitions and apps/services located at the root directory. 

For apps that compile to web, there's a `src` folder with the source scripts (not static HTML, CSS, or images, etc). The `build` or `built` folders contain the publicly-facing source code, which is compiled during the release process automatically.

DO NOT MAKE CHANGES TO THE `.gitignore` UNLESS YOU KNOW EXACTLY WHAT YOU'RE DOING

Additionally, in the `webapp` and `admin` folders, there's a file that is intentionally not committed to github. This file contains build information, debug keys, and other dynamic information that is dynamically generated during build and release. DO NOT COMMIT THESE TO THE REPOSITORY. These files are listed below:

- `admin/src/generated_app_check_secret.ts`
- `webapp/src/generated_app_info.ts`

### Building/Debugging: Admin Console

To build and debug the admin console:

1. Create the file `admin/.env.dev` with the App Check Key you obtained from the repo owner and the key name as `APP_CHECK_KEY`

2. In two separate terminal windows, `cd` into the `admin` directory

3. In one window, run `bun run debug` and `bun run debug-watch`

4. In the second window, run `firebase emulators:start`

5. The entry point for the webapp is `/admin/src/index.ts`. Everything starts out here.

### Building/Debugging: Web App

To build and debug the web app:

1. Create the file `webapp/.env.dev` with the App Check Key you obtained from the repo owner and the key name as `APP_CHECK_KEY`

2. In two separate terminal windows, `cd` into the `webapp` directory

3. In one window, run `bun run debug` and `bun run debug-watch`

4. In the second window, run `firebase emulators:start`

5. The entry point for the webapp is `/webapp/src/index.ts`. Everything starts out here.

### Building/Debugging: Docs

To build and debug the web app:

1. `cd` into the `docs` directory

2. run `npm start`

### Building/Debugging: Azure Functions and Firebase Functions

Follow [Azure Functions local debugging](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-python?pivots=python-mode-decorators#start-the-emulator) and [Firebase Functions local testing](https://firebase.google.com/docs/functions/get-started?gen=2nd#emulate-execution-of-your-functions) steps (note that all intialization beyond signing in with an authorized account has been completed, and should not be re-run)


## Deploying Changes (creating a release)

With the exception of Firebase Functions (for now), all deployment happens automatically when a new GitHub release is created.

This means that when you're done making changes to the code, **and you've tested it to make sure it doesn't break**, simply update the following files, then push to the `main` branch, before creating a release with your new version number:
- version number in `admin/package.json`
- version number in `docs/package.json`
- version number in `webapp/package.json`
- Changelog in `CHANGELOG.md`
  - Ensure you match the existing format for the changelog. The first line should be something like `## v0.x.x`, and there should be a `### Changes` section specific to your new version beneath that, but before the previous version header (`v0.x.x-1`)

When you've confirmed that your code has been tested, your version numbers have been updated, changelog written, and everything pushed to the `main` branch, navigate to the [New Release](https://github.com/rajanphadnis/psp-data-viewer/releases/new) page. Here's the process to initiate a release:

1. Click "Choose a tag" in the top-left-ish of the page

2. Type your new version number, including the "v" at the begining of the version number

3. Click "Create new tag: vX.X.X on publish". If this doesn't show up, go back and bump the version number in the code and here until it does

4. Ensure "Set as the latest release" is checked

5. Click "Publish release"

Leave all other options as empty or their default values.
