import { type AlignedData } from "uplot";
import { plot } from "./plotting_helpers";
import { writeSelectorList } from "../dataset_selector";
import { loadingStatus, type DatasetSeries } from "../types";
import { updateAvailableFeatures } from "../toolbar";
import { updateStatus } from "../web_components";
import { generatePlottedDatasets } from "./dataset_generation";
import { storeActiveDatasets } from "../caching";
import { runCalcsEngine } from "../calcs_engine/calcs_engine";

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
  globalThis.plotDisplayedAxes = series.slice(1).map((s, i) => {
    const thing = s as DatasetSeries;
    return thing.scale;
  });

  if (toPlot.length > 1) {
    // Save dT to global variable
    globalThis.calcChannelDt_seconds = toPlot[0][1] - toPlot[0][0];
  }

  plot(toPlot as AlignedData, series);
  globalThis.displayedRangeStart = startTimestamp;
  globalThis.displayedRangeEnd = endTimestamp;
  writeSelectorList(globalThis.activeDatasets_all);
  updateAvailableFeatures();
  updateStatus(loadingStatus.DONE);
}
