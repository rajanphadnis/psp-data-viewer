import { legendRound } from "./plotting_helpers";
import { getDatasetPlottingColor } from "../theming";
import type { DatasetSeries, DatasetAxis } from "../types";

export function generateAxisAndSeries(
  scale: string,
  dataset: string,
  dataset_name: string,
  dataset_index: number
): [DatasetSeries, DatasetAxis] {
  const scaleToUse: string = scale == "bin" ? "bin" : dataset;
  const scaleUnitLabel: string = scale == "bin" ? "" : scale;
  const isOdd = globalThis.activeDatasets_legend_side[globalThis.activeDatasets_to_add.indexOf(dataset)] % 2 == 1;
  const seriesToReturn: DatasetSeries = {
    label: dataset_name,
    value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
    stroke: getDatasetPlottingColor(dataset_index),
    width: 2,
    scale: scaleToUse,
    spanGaps: true,
  };
  const axisToReturn: DatasetAxis = {
    scale: scaleToUse,
    values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + scaleUnitLabel),
    stroke: "#fff",
    grid: {
      stroke: "#ffffff20",
    },
    side: isOdd ? 3 : 1,
    ticks: {
      show: true,
      stroke: "#80808080",
    },
  };
  return [seriesToReturn, axisToReturn];
}
