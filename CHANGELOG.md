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