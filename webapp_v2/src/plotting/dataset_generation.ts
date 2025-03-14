import { getSensorData } from "../db/db_interaction";
import { generateAxisAndSeries } from "./axes_series_generation";
import type { DatasetSeries, LoadingStateType } from "../types";
import { cacheFetchedData } from "../browser/caching";
import { Setter } from "solid-js";
import { Series } from "uplot";

export async function generatePlottedDatasets(
  datasets: string[],
  startTimestamp: number,
  endTimestamp: number,
  test_id: string,
  dataset_legend_side: number[],
  plotColors: string[],
  displayedSamples: number,
  setLoadingState: Setter<LoadingStateType>,
  prefetch: boolean
): Promise<[number[][], ({} | Series)[]]> {
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
    }--${startTimestamp.toString()}--${endTimestamp.toString()}--${test_id}`;
    if (localStorage[dataset_key]) {
      const axis = dataset_legend_side[i];
      const seriesToReturn = generateAxisAndSeries(scale, datasets[i], nameOnly, i, plotColors, axis);
      toPlot[i] = JSON.parse(localStorage.getItem(dataset_key)!);
      series[i] = seriesToReturn;
    } else {
      channelsToFetch.set(datasets[i], i);
    }
  }
  let need_to_fetch: string[] = channelsToFetch.keys().toArray();
  const need_to_fetch_legendSide = channelsToFetch.values().toArray();
  const legendSidesToFetch = need_to_fetch_legendSide.map((index) => dataset_legend_side[index]);

  if (need_to_fetch.length == 0) {
    console.log("fetching all channels from cache");
    const dataset_key: string = `application_data__time--${startTimestamp.toString()}--${endTimestamp.toString()}--${test_id}`;
    let toPlot_toReturn = [JSON.parse(localStorage.getItem(dataset_key)!), ...toPlot];
    let series_toReturn = [{}, ...series];
    return [toPlot_toReturn, series_toReturn];
  }
  console.log("fetching channels from database: " + need_to_fetch.toString());
  if (!prefetch) {
    setLoadingState({ isLoading: true, statusMessage: "Fetching..." });
  }
  const [toPlot_fetched, series_fetched] = await getSensorData(
    need_to_fetch,
    startTimestamp,
    endTimestamp,
    channelsToFetch,
    test_id,
    displayedSamples,
    plotColors,
    legendSidesToFetch
  );
  for (let i = 0; i < need_to_fetch.length; i++) {
    const fetched_dataset = need_to_fetch[i];
    const indexToWrite = channelsToFetch.get(fetched_dataset)!;
    toPlot[indexToWrite] = toPlot_fetched[i];
    series[indexToWrite] = series_fetched[i];
  }
  let toPlot_toReturn = [toPlot_fetched[toPlot_fetched.length - 1], ...toPlot];
  let series_toReturn = [{}, ...series];
  if (!prefetch) {
    setLoadingState({ isLoading: true, statusMessage: "Caching..." });
  }
  cacheFetchedData(
    toPlot_fetched,
    [...need_to_fetch, "time"],
    startTimestamp,
    endTimestamp,
    test_id,
    datasets,
    dataset_legend_side
  );
  console.log(toPlot_fetched);
  return [toPlot_toReturn, series_toReturn];
}
