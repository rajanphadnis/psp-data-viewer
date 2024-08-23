import { type AlignedData } from "uplot";
import { getSensorData } from "./db_interaction";
import { legendRound, plot } from "./plotting_helpers";
import { getDatasetPlottingColor } from "./theming";
import { writeSelectorList } from "./dataset_selector";
import { updateStatus } from "./browser_fxns";
import { loadingStatus, type DatasetSeries } from "./types";
import { updateAvailableFeatures } from "./toolbar";

export async function generatePlottedDatasets(
  datasets: string[],
  startTimestamp: number,
  endTimestamp: number
): Promise<[number[][], ({} | DatasetSeries)[]]> {
  let channelsToFetch: Map<string, number> = new Map();
  let toPlot: number[][] = new Array(datasets.length).fill([]);
  let series: ({} | DatasetSeries)[] = new Array(datasets.length).fill({});
  if (datasets.length == 0) {
    return [toPlot, series];
  }
  for (let i = 0; i < datasets.length; i++) {
    const nameOnly: string = datasets[i].split("__")[0];
    const scale: string = datasets[i].split("__")[1];
    const dataset_key: string = `application_data__${
      datasets[i]
    }--${startTimestamp.toString()}--${endTimestamp.toString()}`;
    if (localStorage[dataset_key]) {
      toPlot[i] = JSON.parse(localStorage.getItem(dataset_key)!);
      series[i] = {
        label: nameOnly,
        value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
        stroke: getDatasetPlottingColor(i),
        width: 2,
        scale: scale,
        spanGaps: true,
      };
    } else {
      channelsToFetch.set(datasets[i], i);
    }
  }
  let need_to_fetch: string[] = channelsToFetch.keys().toArray();

  if (need_to_fetch.length == 0) {
    const dataset_key: string = `application_data__time--${startTimestamp.toString()}--${endTimestamp.toString()}`;
    let toPlot_toReturn = [JSON.parse(localStorage.getItem(dataset_key)!), ...toPlot];
    let series_toReturn = [{}, ...series];
    return [toPlot_toReturn, series_toReturn];
  }
  console.log("fetching channels from database: " + need_to_fetch.toString());
  const [toPlot_fetched, series_fetched] = await getSensorData(
    need_to_fetch,
    startTimestamp,
    endTimestamp,
    channelsToFetch
  );
  for (let i = 0; i < need_to_fetch.length; i++) {
    const fetched_dataset = need_to_fetch[i];
    const indexToWrite = channelsToFetch.get(fetched_dataset)!;
    toPlot[indexToWrite] = toPlot_fetched[i];
    series[indexToWrite] = series_fetched[i];
  }
  let toPlot_toReturn = [toPlot_fetched[toPlot_fetched.length - 1], ...toPlot];
  let series_toReturn = [{}, ...series];
  cacheFetchedData(toPlot_fetched, [...need_to_fetch, "time"], startTimestamp, endTimestamp);
  return [toPlot_toReturn, series_toReturn];
}

function cacheFetchedData(toPlot: number[][], need_to_fetch: string[], startTimestamp: number, endTimestamp: number) {
  for (let i = 0; i < need_to_fetch.length; i++) {
    if (toPlot[i].length > 1) {
      const plotData = JSON.stringify(toPlot[i]);
      const dataset_key: string = `application_data__${
        need_to_fetch[i]
      }--${startTimestamp.toString()}--${endTimestamp.toString()}`;
      console.log(`storing in cache: ${dataset_key}`);
      localStorage.setItem(dataset_key, plotData);
    }
  }
}

function storeActiveDatasets(data: number[][], datasetNames: string[]) {
  const actualNames = ["time", ...datasetNames];
  localStorage.setItem("currentData_data", JSON.stringify(data));
  localStorage.setItem("currentData_names", JSON.stringify(actualNames));
}

export async function update(
  startTimestamp: number = globalThis.starting_timestamp,
  endTimestamp: number = globalThis.ending_timestamp
) {
  updateStatus(loadingStatus.LOADING);
  let [toPlot, series] = await generatePlottedDatasets(globalThis.activeDatasets_to_add, startTimestamp, endTimestamp);
  storeActiveDatasets(toPlot, globalThis.activeDatasets_to_add);
  plot(toPlot as AlignedData, series);
  globalThis.displayedRangeStart = startTimestamp;
  globalThis.displayedRangeEnd = endTimestamp;
  writeSelectorList(globalThis.activeDatasets_all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}
