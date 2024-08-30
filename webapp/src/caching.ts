import { getSharelink } from "./browser_interactions";
import { defaultPlottingColors, measuringToolDefaultColor } from "./theming";
import { loadingStatus } from "./types";
import { updateStatus } from "./web_components";

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
}export function storeActiveDatasets(data: number[][], datasetNames: string[]) {
  const actualNames = ["time", ...datasetNames];
  localStorage.setItem("currentData_data", JSON.stringify(data));
  localStorage.setItem("currentData_names", JSON.stringify(actualNames));
}
export function initColorList() {
  let storageItem = localStorage.getItem("plotting_color_pallette_color_list");
  if (storageItem == null) {
    globalThis.plotPalletteColors = defaultPlottingColors;
  } else {
    globalThis.plotPalletteColors = JSON.parse(storageItem);
  }
}

