import { legendRound } from "./plotting_helpers";
import { getDatasetPlottingColor } from "../theming";
import type { DatasetSeries } from "../types";

/**
 * Generates a plot series entry based on provided vals
 *
 * @param scale The units the dataset has (i.e: `psi`)
 *
 * @param dataset The computer-readable dataset name
 *
 * @param dataset_name The human-readable dataset name
 *
 * @param dataset_index The index of the dataset to plot,
 * based on the order the dataset was called on
 *
 * @param axis_side The axis set to write the dataset to
 * (between 1 and 6). Default value is zero. If default
 * val is used, the `axis_side` value from the global
 * app state is used instead
 *
 * @returns A `DatasetSeries`
 *
 */
export function generateAxisAndSeries(
  scale: string,
  dataset: string,
  dataset_name: string,
  dataset_index: number,
  plotColors: string[],
  axis_side: number
): DatasetSeries {
  // Create a string that will group units on the same axis together
  const scaleToUse: string = `${scale}_${axis_side}`;

  // Generate the series and get the plotting color based on the dataset_index value
  const seriesToReturn: DatasetSeries = {
    label: dataset_name,
    value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
    stroke: getDatasetPlottingColor(plotColors, dataset_index),
    width: 2,
    scale: scaleToUse,
    spanGaps: true,
  };

  // Return the series
  return seriesToReturn;
}
