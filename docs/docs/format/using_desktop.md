---
sidebar_position: 4
---

# HDF5 Generation

If you'd prefer to manually create your own HDF5 files, that's fine as well!

To create an HDF5 file that works with the Dataviewer.Space platform, there are just a few criteria:

1. The HDF5 file should not have any groups. All datasets should be written to the root of the file
2. There have to be at least two datasets in an HDF5 file.
   - One of these datasets have to be named `time`, and have to have a type of `f64`, where each value is a UNIX epoch timestamp in milliseconds. This dataset cannot have any `null` values.
   - All other datasets must be of type `number` (true/false values must be converted to `1`/`0`), but can contain `null` values

To format the dataset names, make sure the following conditions are met:

1. Dataset names cannot contain the following characters:

- `\`
- `/`
- `::` (double colon)
- ` ` (whitespace)

2. For all datasets other than `time`, dataset names should follow this schema: `name__unit__`
   - `name` is the channel name
     - Channel names cannot contain the following characters:
       - `\`
       - `/`
       - `__` (double underscore) (a single underscore is fine)
       - `::` (double colon)
       - ` ` (whitespace)
   - `unit` is the channel's unit
     - If you don't know the channel's unit, put `raw` (or `bin` for true/false data)
     - `unit` can contain only letters and numbers (no special symbols like `^` or `_`)
