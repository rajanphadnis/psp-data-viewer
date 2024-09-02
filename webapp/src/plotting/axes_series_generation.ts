import { legendRound } from "./plotting_helpers";
import { getDatasetPlottingColor } from "../theming";
import type { DatasetSeries } from "../types";

export function generateAxisAndSeries(
  scale: string,
  dataset: string,
  dataset_name: string,
  dataset_index: number,
): DatasetSeries {
  const legendSide = globalThis.activeDatasets_legend_side[globalThis.activeDatasets_to_add.indexOf(dataset)];
  const scaleToUse: string = `${scale}_${legendSide}`;
  const seriesToReturn: DatasetSeries = {
    label: dataset_name,
    value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
    stroke: getDatasetPlottingColor(dataset_index),
    width: 2,
    scale: scaleToUse,
    spanGaps: true,
  };
  return seriesToReturn;
}
