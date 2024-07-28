import type { Firestore } from "firebase/firestore";
import { join, type AlignedData } from "uplot";
import { getSensorData } from "./db_interaction";
import { legendRound, plot } from "./plotting_helpers";
import { datasetPlottingColors, pspColors } from "./theming";
import { writeSelectorList } from "./dataset_selector";
import { loader, check_mark } from "./html_components";
import { updateStatus } from "./browser_fxns";
import { loadingStatus } from "./types";
import { updateAvailableFeatures } from "./toolbar";

export async function generatePlottedDatasets(
  datasets: string[],
  startTimestamp: number | undefined = undefined,
  endTimestamp: number | undefined = undefined
) : Promise<[number[][], ({} | {
    label: string;
    value: (self: any, rawValue: number) => string;
    stroke: string;
    width: number;
    scale: string;
    spanGaps: boolean;
  })[]]> {
  // Do caching stuff here
  const [toPlot, series] = await getSensorData(datasets, startTimestamp, endTimestamp);
  return [toPlot, series];
}



export async function update() {
  updateStatus(loadingStatus.LOADING);
  let [toPlot, series] = await generatePlottedDatasets(globalThis.activeDatasets.to_add);
  plot(toPlot as AlignedData, series);
  writeSelectorList(globalThis.activeDatasets.all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}
