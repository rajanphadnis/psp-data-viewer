import { defaultPlottingColors, measuringToolDefaultColor } from "../theming";
import { CalcChannel } from "../types";
import { getSharelink } from "./sharelink";

export function getDefaultMeasuringToolColor() {
  const fromStorage = localStorage.getItem("measuringToolPointColor");
  if (fromStorage == null) {
    return measuringToolDefaultColor;
  }
  return fromStorage;
}

export async function cacheFetchedData(
  toPlot: number[][],
  need_to_fetch: string[],
  startTimestamp: number,
  endTimestamp: number,
  test_id: string,
  datasets: string[],
  legend_list: number[]
) {
  for (let i = 0; i < need_to_fetch.length; i++) {
    if (toPlot[i].length > 1) {
      const plotData = JSON.stringify(toPlot[i]);
      const dataset_key: string = `application_data__${
        need_to_fetch[i]
      }--${startTimestamp.toString()}--${endTimestamp.toString()}--${test_id}`;
      console.log(`storing in cache: ${dataset_key}`);
      try {
        localStorage.setItem(dataset_key, plotData);
      } catch (e: any) {
        if (e.name === "QuotaExceededError") {
          // Handle the LocalStorage quota exceeded error
          console.error("LocalStorage Quota Exceeded. Please free up some space.");
          alert("Cache is full. Will now clear cache and reload page. This might take a few additional seconds.");
          // setLoadingState({ isLoading: true, statusMessage: "Clearing Cache..." });
          localStorage.clear();
          sessionStorage.clear();
          const dbs = await window.indexedDB.databases();
          dbs.forEach(async (db) => {
            await window.indexedDB.deleteDatabase(db.name!);
          });
          const [link, b64] = getSharelink(datasets, startTimestamp, endTimestamp, legend_list);
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
export async function storeActiveDatasets(
  data: number[][],
  datasetNames: string[],
  startTimestamp: number,
  endTimestamp: number,
  legend_list: number[]
) {
  const actualNames = ["time", ...datasetNames];
  try {
    localStorage.setItem("currentData_data", JSON.stringify(data));
    localStorage.setItem("currentData_names", JSON.stringify(actualNames));
  } catch (e: any) {
    if (e.name === "QuotaExceededError") {
      // Handle the LocalStorage quota exceeded error
      console.error("LocalStorage Quota Exceeded. Please free up some space.");
      alert(
        "Cache is full. Will now self-heal by clearing cache and reloading page.\n\nThis might take a few additional seconds."
      );

      // updateStatus(loadingStatus.LOADING);
      localStorage.clear();
      sessionStorage.clear();
      const dbs = await window.indexedDB.databases();
      dbs.forEach(async (db) => {
        await window.indexedDB.deleteDatabase(db.name!);
      });
      const [link, b64] = getSharelink(datasetNames, startTimestamp, endTimestamp, legend_list);
      window.location.href = link;
    } else {
      // Handle other exceptions
      console.error("An error occurred:", e);
      alert(`An error occurred: ${e}`);
    }
  }
}

/**
 * Initializes the plotting color pallette.
 *
 * If the color pallete hasn't been saved to the cache, init to the default
 * plotting colors. Otherwise, load the color pallette from the cache
 *
 * @returns None
 *
 */
export function initColorList(context: any) {
  let storageItem = localStorage.getItem("plotting_color_pallette_color_list");
  if (storageItem == null) {
    context.setPlotPalletteColors(defaultPlottingColors);
    // globalThis.plotPalletteColors = defaultPlottingColors;
  } else {
    context.setPlotPalletteColors(JSON.parse(storageItem));
    // globalThis.plotPalletteColors = JSON.parse(storageItem);
  }
}

export function saveCalcChannels(data: CalcChannel[]) {
  localStorage.setItem("calc_channels", JSON.stringify(data));
}

// export function initCalcChannels() {
//   let storageItem = localStorage.getItem("calc_channels");
//   if (storageItem == null) {
//     globalThis.calcChannels = [];
//   } else {
//     globalThis.calcChannels = JSON.parse(storageItem);
//   }
// }
