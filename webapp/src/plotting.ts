import { type AlignedData } from "uplot";
import { getSensorData } from "./db_interaction";
import { generateAxisAndSeries, legendRound, plot } from "./plotting_helpers";
import { getDatasetPlottingColor } from "./theming";
import { writeSelectorList } from "./dataset_selector";
import { getSharelink, updateStatus } from "./browser_fxns";
import { loadingStatus, type DatasetAxis, type DatasetSeries } from "./types";
import { updateAvailableFeatures } from "./toolbar";

export async function generatePlottedDatasets(
  datasets: string[],
  startTimestamp: number,
  endTimestamp: number
): Promise<[number[][], ({} | DatasetSeries)[], DatasetAxis[]]> {
  let channelsToFetch: Map<string, number> = new Map();
  let toPlot: number[][] = new Array(datasets.length).fill([]);
  let series: ({} | DatasetSeries)[] = new Array(datasets.length).fill({});
  let axes: DatasetAxis[] = [];
  if (datasets.length == 0) {
    return [toPlot, series, axes];
  }
  for (let i = 0; i < datasets.length; i++) {
    const nameOnly: string = datasets[i].split("__")[0];
    const scale: string = datasets[i].split("__")[1];
    const dataset_key: string = `application_data__${
      datasets[i]
    }--${startTimestamp.toString()}--${endTimestamp.toString()}--${globalThis.test_id}`;
    if (localStorage[dataset_key]) {
      const [seriesToReturn, axisToReturn] = generateAxisAndSeries(scale, datasets[i], nameOnly, i);
      toPlot[i] = JSON.parse(localStorage.getItem(dataset_key)!);
      series[i] = seriesToReturn;
      axes[i] = axisToReturn;
    } else {
      channelsToFetch.set(datasets[i], i);
    }
  }
  let need_to_fetch: string[] = channelsToFetch.keys().toArray();

  if (need_to_fetch.length == 0) {
    const dataset_key: string = `application_data__time--${startTimestamp.toString()}--${endTimestamp.toString()}--${
      globalThis.test_id
    }`;
    let toPlot_toReturn = [JSON.parse(localStorage.getItem(dataset_key)!), ...toPlot];
    let series_toReturn = [{}, ...series];
    let axes_toReturn = [
      {
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20",
        },
        ticks: {
          show: true,
          stroke: "#80808080",
        },
      } as DatasetAxis,
      ...axes,
    ];
    return [toPlot_toReturn, series_toReturn, axes_toReturn];
  }
  console.log("fetching channels from database: " + need_to_fetch.toString());
  const [toPlot_fetched, series_fetched, axes_fetched] = await getSensorData(
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
    console.log(axes_fetched[i]);
    axes[indexToWrite] = axes_fetched[i];
  }
  let toPlot_toReturn = [toPlot_fetched[toPlot_fetched.length - 1], ...toPlot];
  let series_toReturn = [{}, ...series];
  let axes_toReturn = [
    {
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    } as DatasetAxis,
    ...axes,
  ];
  cacheFetchedData(toPlot_fetched, [...need_to_fetch, "time"], startTimestamp, endTimestamp);
  return [toPlot_toReturn, series_toReturn, axes_toReturn];
}

async function cacheFetchedData(
  toPlot: number[][],
  need_to_fetch: string[],
  startTimestamp: number,
  endTimestamp: number
) {
  for (let i = 0; i < need_to_fetch.length; i++) {
    if (toPlot[i].length > 1) {
      const plotData = JSON.stringify(toPlot[i]);
      const dataset_key: string = `application_data__${
        need_to_fetch[i]
      }--${startTimestamp.toString()}--${endTimestamp.toString()}--${globalThis.test_id}`;
      console.log(`storing in cache: ${dataset_key}`);
      try {
        localStorage.setItem(dataset_key, plotData);
      } catch (e: any) {
        if (e.name === "QuotaExceededError") {
          // Handle the LocalStorage quota exceeded error
          console.error("LocalStorage Quota Exceeded. Please free up some space.");
          alert("Cache is full. Will now clear cache and reload page. This might take a few additional seconds.");

          updateStatus(loadingStatus.LOADING);
          localStorage.clear();
          sessionStorage.clear();
          const dbs = await window.indexedDB.databases();
          dbs.forEach(async (db) => {
            await window.indexedDB.deleteDatabase(db.name!);
          });
          const [link, b64] = getSharelink();
          window.location.href = link;
        } else {
          // Handle other exceptions
          console.error("An error occurred:", e);
          alert(`An error occurred: ${e}`);
        }
      }
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
  const [toPlot, generated_series, generated_axes] = await generatePlottedDatasets(
    globalThis.activeDatasets_to_add,
    startTimestamp,
    endTimestamp
  );
  storeActiveDatasets(toPlot, globalThis.activeDatasets_to_add);
  const [series, axes] = consolidateLegends(generated_series, generated_axes);
  plot(toPlot as AlignedData, generated_series, generated_axes);
  globalThis.displayedRangeStart = startTimestamp;
  globalThis.displayedRangeEnd = endTimestamp;
  writeSelectorList(globalThis.activeDatasets_all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}

function consolidateLegends(series: ({} | DatasetSeries)[], axes: DatasetAxis[]) {
  return [series, axes];
}
