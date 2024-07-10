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

export async function generatePlottedDatasets(datasets: string[], startTimestamp: number | undefined = undefined, endTimestamp: number | undefined = undefined) {
  let series: (
    | {}
    | {
        label: string;
        value: (self: any, rawValue: number) => string;
        stroke: string;
        width: number;
        scale: string;
        spanGaps: boolean;
      }
  )[] = [{}];
  let toPlot: any = [];
  for (let i = 0; i < datasets.length; i++) {
    const dataset: string = datasets[i];
    const fromCache: boolean = activeDatasets.cached.includes(dataset);
    // const [time, data, scale] = await getSensorData(dataset, fromCache);
    const [time, data, scale] = await getSensorData(dataset, false, startTimestamp, endTimestamp);
    toPlot[0] = time;
    toPlot.push(data);
    series.push({
      label: dataset,
      value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
      stroke: datasetPlottingColors[i],
      width: 2,
      scale: scale,
      spanGaps: true,
    });
  }
  return [toPlot, series];
}

function actuallyPlot(
  toPlot: any = [],
  series: (
    | {}
    | {
        label: string;
        value: (self: any, rawValue: number) => string;
        stroke: string;
        width: number;
        scale: string;
        spanGaps: boolean;
      }
  )[]
) {
  plot(toPlot, series);
}

export async function update() {
  updateStatus(loadingStatus.LOADING);
  let [toPlot, series] = await generatePlottedDatasets(activeDatasets.to_add);
  actuallyPlot(toPlot, series);
  writeSelectorList(activeDatasets.all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}
