---
sidebar_position: 3
---

# Using the Desktop Formatter

The desktop formatter (download portable `.exe` or windows installer [here](https://github.com/rajanphadnis/psp-data-viewer/releases/latest)) is a convenience-oriented tool to compile TDMS and CSV files into an HDF5 file that you can upload to Dataviewer.Space (in the Admin Console, assuming you have an account with your Organization).

## Capabilities

The Desktop Formatter is built using Tauri (SolidJS frontend + Rust backend) so that all computations and file processing use Rust. Both `.tdms` and `.csv` file imports are supported (see limitations below).

When reading `.tdms` and `.csv` files, the Desktop Formatter will use all available resources to process files as fast as possible. This usually means pinning CPU usage at ~100% utilization, and using as much RAM as is available. Progress and status are displayed within the app on a best-effort basis (not all status updates will be pushed to the log in the correct order).

For reference, it usually takes ~5 seconds to compile a single TDMS file with 3 channels, each having ~2 million datapoints. Using pre-indexed TDMS files, it usually takes ~65 seconds to compile two TDMS files with a total of 31 channels, each with ~2 million datapoints (CPU: i7-13700H, 14 cores, 20 LPs. RAM: 16GB).

## TDMS Limitations

All TDMS files are supported, as long as they support TDMS version 4713 or later, and do not contain DAQmx data.

TDMS channels have the following limitations:

- All channel names must be unique during the same time period. If duplicate channels are found, their data will be merged with no guarantee on which values from which channels are preserved.
  - Note that importing multiple TDMS files with the same channel name but with different time periods will still merge the channels, but will keep all non-overlapping data
- Channel names cannot contain the following characters:
  - `\`
  - `/`
  - `__` (double underscore)
  - `::` (double colon)
  - ` ` (whitespace)
- Each channel must have the `Channel Type` property defined (must be a string)
- All Analog channels must:
  - Have a `Channel Type` that includes the characters `AI`
  - Define a `Offset` gathered during the zeroing or calibration process
  - Define a `Slope` gathered during the zeroing or calibration process
  - Define a `Unit` for the calibrated/calculated data. If a `Unit` is not defined, data is assumed to be binary (values of only `1` or `0`)
  - Define a `Zeroing Correction` gathered during the zeroing or calibration process

:::info Corrupted TDMS files

Corrupted or improperly segmented TDMS files are not supported. Your best bet here is to use an official NI tool to open the data and save it to a CSV file, then import that CSV.

:::

## CSV Limitations

There must be exactly one column in the CSV file called `time`. Each column is considered to be a different channel, and will be directly added to the resulting HDF5 file with no calculations or cleaning. 

### How to name your channels:

Since each column (except for the `time` column) represents a different channel, it's important to know how to name the channel so that the platform can parse and process it appropriately. 

The basics are simple: each channel is of the format `name__unit__`, where `name` is the channel name (see limitations below), and `unit` is the channel's unit. If you don't know the channel's unit, put `raw`.

Channel name limitations:
- Channel names cannot contain the following characters:
  - `\`
  - `/`
  - `__` (double underscore)
  - `::` (double colon)
  - ` ` (whitespace)

Channel unit limitations:
- Units can contain only letters and numbers (no special symbols like `^` or `_`)
- To specify binary data, use the unit `bin`
- To specifiy raw data or data with unknown units, use the unit `raw`
