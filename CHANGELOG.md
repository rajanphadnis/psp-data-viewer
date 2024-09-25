## v0.4.6
added browser warning message

### Changed
- bug fixes

## v0.4.5
added integration and derivative functions to calc channels

### Changed
- bug fixes

## v0.4.4
added delete button copy and re-arranged admin console

### Changed
- bug fixes

## v0.4.3
added admin console input and file checker

### Changed
- bug fixes

## v0.4.2
re-arranged admin console and alphabetized test lists

### Changed
- bug fixes

## v0.4.1
added plotting axis padding

### Changed
- bug fixes

## v0.4.0
added admin tdms delay

### Changed
- bug fixes
- Added admin tdms delay

## v0.3.12
added analytics tab

### Changed
- bug fixes

## v0.3.11
upgraded docusaurus and added admin tracker

### Changed
- bug fixes

## v0.3.10
added google analytics to docs

### Changed
- bug fixes

## v0.3.9
added google analytics to docs

### Changed
- bug fixes

## v0.3.8
updated docs

### Changed
- bug fixes

## v0.3.7
updated gtag position

### Changed
- bug fixes

## v0.3.6
updated clipping overlay

### Changed
- bug fixes

## v0.3.5
updated google tag

### Changed
- bug fixes

## v0.3.4
added google tag

### Changed
- bug fixes

## v0.3.3
bug fixes

### Changed
- bug fixes

## v0.3.2
added inplace plot documentation hint and dataset selector axis arrows

### Changed
- bug fixes

## v0.3.1
bug fixes

### Changed
- bug fixes

## v0.3.0
Admin security improvements and automation overhaul

### Changed
- bug fixes
- Admin console automation added
- Fixed inability to edit test name and articels in admin console by adding firebase function
- Added time channel filtering on new test create
- Finished up `bun run deploy` automation (still need to document usage)
- Fixed calc channel axis side weirdness
- Overall product is now more mature and better preapred for launch

## v0.2.15
bug fixes

### Changed
- bug fixes

## v0.2.14
bug fixes

### Changed
- bug fixes

## v0.2.13
bug fixes

### Changed
- bug fixes

## v0.2.12
bug fixes

### Changed
- bug fixes

## v0.2.11
bug fixes

### Changed
- bug fixes

## v0.2.10
Added search to docs

### Changed
- Added Algolia DocSearch to Docs

## v0.2.9
Bug fixes

### Changed
- idk

## v0.2.8
Bug fixes

### Changed
- idk

## v0.2.7
added calcs engine

### Changed
- Added calcs engine
- Added calcs editing settings panel
- Moved measuring tool color picker to settings panel
- Added `hr` to calcs channel editing page
- Added measurement display dissipation after modal opening
- Changed multi-axis to handle 6 axes sets
- Added multi-axis consolidation
- Updated docs

## v0.2.6
added measuring tool, added keyboard shortcuts huge refactor, added y-axis control

### Changed
- Added measuring tool
- Added measuring tool point color settings
- Refactored entire wabapp codebase into far more manageable code
- Added document-level keyboard shortcuts to open and close modals
- Updated docs for measuring tool
- Added binary plotting axes consolidation
- Added ability to change y-axis positioning
- Added y-axis control to sharelink

## v0.2.5
changed annotation api response format

### Changed
- added annotations to "annotations" key

## v0.2.4
version bump

### Changed
- version bump

## v0.2.3
version bump

### Changed
- version bump

## v0.2.2
Fixed verbose logging and added a lot of documentation, added annotation support to API

### Changed
- removed standard logging
- added API documentation
- updated README
- Added annotation support to API

## v0.2.1
Fixed function deploy and memory constraints

### Changed
- fixed db ref in function deploy
- fixed admin finalizing messaging
- added firebase function memory constraints to functions (8GB, 2 cores)

## v0.2.0
Added admin upload capability

### Changed
- added admin upload pane
- added firebase functions to upload, process, transfer, compile, parse, and update everything needed to create a new test
- added admin "finalize" button and panel
- added infrastructure to support input checking

## v0.1.6
Small bug fixes

### Changed
- added metadata caching

## v0.1.5
Small bug fixes

### Changed
- small bug fixes

## v0.1.4
Small bug fixes

### Changed
- small bug fixes

## v0.1.3
Added color pallette picker

### Changed
- Added settings panel
- Added color pallette picker
- Added version and build date settings footer
- Added quick links to settings panel

## v0.1.2
Fixed client-side CSV generation, plot zooming

### Changed
- Moved client-side CSV generation to localStorage-based csv gen
- Added sharelink zoom capability
- Fixed zoom bug on adding new dataset

## v0.1.1
Small bug fixes

### Changed
- Updated auto-deploy

## v0.1.0
Started documentation site, started admin new test page

### Changed
- Started documentation site
- Added doc auto-deploy
- Started new test page on admin site

## v0.0.9
Moved stack over to azure hdf5 expansion. Still using firebase for basic key-value pair storage

### Changed
- Moved stack over to azure hdf5 expansion
- Still using firebase for basic key-value pair storage
- Fixed zoom selection
- Added dynamic resolution data gathering
- Added test metadata function
- started to add documentation

## v0.0.8
Added more robust csv file fetching/creation

### Changed
- Added automatic redirect to download CSV file
- Made getCSV() more robust and added csv temp storage
- Added trim time to datasets to createTest()
- Added auto-gen test id in admin console

## v0.0.7
Added initial functions for createing new tests and getting csv files

### Changed
- Added getCSV()
- Added createTest()

## v0.0.6
Added "Clear Cache and Restart button"

### Changed
- Added "Clear Cache and Restart button"

## v0.0.5
Added Admin Console framework

### Changed
- Added Admin Console framework

## v0.0.4
Added image export and toolbar framework

### Changed
- Added ability to export image to clipboard
- Added ability to download image
- Added toolbar framework
- Separated plot colors for future customization

## v0.0.3
Added App Check

### Changed
- Added Firebase App Check

## v0.0.2
Initial release.

### Changed
- Converted from Flutter to a vanilla JS app (using bun for speed)
- Added sharelink generation/parsing
- Added test switcher
- Added uplot
- Added dataset add/remove buttons
- Added loading/ready/status icon
- Added local-first fetching

## v0.0.1
Initial release to verify CD pipeline

### Changed
- everything