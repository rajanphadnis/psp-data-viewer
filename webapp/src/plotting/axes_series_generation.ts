import { legendRound } from "./plotting_helpers";
import { getDatasetPlottingColor } from "../theming";
import type { DatasetSeries } from "../types";

export function generateAxisAndSeries(
  scale: string,
  dataset: string,
  dataset_name: string,
  dataset_index: number,
  axis_side: number = 0,
): DatasetSeries {
  let legendSide = axis_side;
  if (axis_side == 0) {
    legendSide = globalThis.activeDatasets_legend_side[globalThis.activeDatasets_to_add.indexOf(dataset)];
  }
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
