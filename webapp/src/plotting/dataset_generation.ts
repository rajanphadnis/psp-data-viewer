import { getSensorData } from "../db_interaction";
import { generateAxisAndSeries } from "./axes_series_generation";
import type { DatasetSeries } from "../types";
import { cacheFetchedData } from "../caching";

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
    }--${startTimestamp.toString()}--${endTimestamp.toString()}--${globalThis.test_id}`;
    if (localStorage[dataset_key]) {
      const seriesToReturn = generateAxisAndSeries(scale, datasets[i], nameOnly, i);
      toPlot[i] = JSON.parse(localStorage.getItem(dataset_key)!);
      series[i] = seriesToReturn;
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
