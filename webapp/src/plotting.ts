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
  startTimestamp: number,
  endTimestamp: number
): Promise<
  [
    number[][],
    (
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
  ]
> {
  var headers: string[] = [];
  let toPlot: number[][] = [[], []];
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
  for (let i = 0; i < datasets.length; i++) {
    const nameOnly: string = datasets[i].split("__")[0];
    const scale: string = datasets[i].split("__")[1];
    const dataset_key: string = `${datasets[i]}--${startTimestamp.toString()}--${endTimestamp.toString()}`;
    if (localStorage[dataset_key]) {
      headers.push(datasets[i]);
      toPlot[i] = JSON.parse(localStorage.getItem(dataset_key)!);
      series.push({
        label: nameOnly,
        value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
        stroke: datasetPlottingColors[i],
        width: 2,
        scale: scale,
        spanGaps: true,
      });
    }
  }
  let need_to_fetch = datasets.filter((x) => !headers.includes(x));

  if (headers.length != 0) {
    const timestamps = JSON.parse(
      localStorage.getItem(`time--${startTimestamp.toString()}--${endTimestamp.toString()}`)!
    );
    toPlot = [timestamps, ...toPlot];
    if (need_to_fetch.length > 0) {
      const [toPlot_fetched, series_fetched] = await getSensorData(need_to_fetch, startTimestamp, endTimestamp);
      let newToPlot = toPlot_fetched.slice(1);
      let newseries = series_fetched.slice(1);
      let toPlot_toReturn = [...toPlot, ...newToPlot];
      let series_toReturn = [...series, ...newseries];
      console.log("returning from cache and fetch");
      console.log([toPlot_toReturn, series_toReturn]);
      storeInCache(newToPlot, need_to_fetch, startTimestamp, endTimestamp);
      return [toPlot_toReturn, series_toReturn];
    } else {
      console.log("returning only from cache");
      console.log([toPlot, series]);
      return [toPlot, series];
    }
  } else {
    const [toPlot_fetched, series_fetched] = await getSensorData(need_to_fetch, startTimestamp, endTimestamp);
    console.log("no cached data to return");
    if (datasets.length > 0) {
      storeInCache(toPlot_fetched, ["time", ...need_to_fetch], startTimestamp, endTimestamp);
    }
    return [toPlot_fetched, series_fetched];
  }
}

function storeInCache(toPlot: number[][], need_to_fetch: string[], startTimestamp: number, endTimestamp: number) {
  for (let i = 0; i < need_to_fetch.length; i++) {
    if (toPlot[i].length > 1) {
      const plotData = JSON.stringify(toPlot[i]);
      const dataset_key: string = `${need_to_fetch[i]}--${startTimestamp.toString()}--${endTimestamp.toString()}`;
      console.log(`storing in cache: ${dataset_key}`);
      localStorage.setItem(dataset_key, plotData);
    }
  }
}

export async function update(
  startTimestamp: number = globalThis.starting_timestamp,
  endTimestamp: number = globalThis.ending_timestamp
) {
  updateStatus(loadingStatus.LOADING);
  let [toPlot, series] = await generatePlottedDatasets(globalThis.activeDatasets.to_add, startTimestamp, endTimestamp);
  plot(toPlot as AlignedData, series);
  writeSelectorList(globalThis.activeDatasets.all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}
