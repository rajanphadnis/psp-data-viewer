---
sidebar_position: 2
---

# API Data Format

## Timestamps

When fetching from the API, the `time` channel will always be returned. The time channel is of type `f64`, where each value is a UNIX epoch timestamp in seconds (UTC).

Timestamps can be easily converted by most programming languages (API reference for Python, JS/TS, Rust), and you can also use an online tool to do basic conversion: [https://www.epochconverter.com/](https://www.epochconverter.com/)

## Data

Data is stored in HDF5 files as type `f64`. Null values are supported as `f64::NAN` values as defined by [IEEE 754](https://www.wikiwand.com/en/articles/IEEE_754#NaNs)
