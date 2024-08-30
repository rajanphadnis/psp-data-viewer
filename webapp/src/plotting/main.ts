import { type AlignedData } from "uplot";
import { plot } from "./plotting_helpers";
import { writeSelectorList } from "../dataset_selector";
import { loadingStatus } from "../types";
import { updateAvailableFeatures } from "../toolbar";
import { updateStatus } from "../web_components";
import { generatePlottedDatasets } from "./dataset_generation";
import { storeActiveDatasets } from "../caching";
import { consolidateLegends } from "./legend_axes_consolidation";

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
  plot(toPlot as AlignedData, series, axes);
  globalThis.displayedRangeStart = startTimestamp;
  globalThis.displayedRangeEnd = endTimestamp;
  writeSelectorList(globalThis.activeDatasets_all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}
