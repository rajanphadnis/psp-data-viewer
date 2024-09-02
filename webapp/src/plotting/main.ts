import { type AlignedData } from "uplot";
import { plot } from "./plotting_helpers";
import { writeSelectorList } from "../dataset_selector";
import { loadingStatus } from "../types";
import { updateAvailableFeatures } from "../toolbar";
import { updateStatus } from "../web_components";
import { generatePlottedDatasets } from "./dataset_generation";
import { storeActiveDatasets } from "../caching";
import { runCalcsEngine } from "../tools/calcs_engine";

export async function update(
  startTimestamp: number = globalThis.starting_timestamp,
  endTimestamp: number = globalThis.ending_timestamp
) {
  updateStatus(loadingStatus.LOADING);
  const [generated_toPlot, generated_series] = await generatePlottedDatasets(
    globalThis.activeDatasets_to_add,
    startTimestamp,
    endTimestamp
  );
  storeActiveDatasets(generated_toPlot, globalThis.activeDatasets_to_add);
  const [toPlot, series] = runCalcsEngine(generated_toPlot, generated_series);
  plot(toPlot as AlignedData, series);
  globalThis.displayedRangeStart = startTimestamp;
  globalThis.displayedRangeEnd = endTimestamp;
  writeSelectorList(globalThis.activeDatasets_all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}
