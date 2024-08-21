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