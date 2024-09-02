import { getDefaultMeasuringToolColor } from "./caching";
import { check_mark, loader } from "./html_components";
import { loadingStatus } from "./types";

export function updateStatus(status: loadingStatus) {
  if (status == loadingStatus.LOADING) {
    document.getElementById("status")!.innerHTML = loader;
  }
  if (status == loadingStatus.DONE) {
    document.getElementById("status")!.innerHTML = check_mark;
  }
}

export function initGlobalVariables() {
  globalThis.activeDatasets_to_add = [];
  globalThis.activeDatasets_all = [];
  globalThis.activeDatasets_loading = [];
  globalThis.activeDatasets_cached = [];
  globalThis.activeDatasets_legend_side = [];
  globalThis.plotDisplayedAxes = [];
  globalThis.x1 = null;
  globalThis.x2 = null;
  globalThis.y1 = [];
  globalThis.y2 = [];
  globalThis.measuringToolColor = getDefaultMeasuringToolColor();
  globalThis.displayedSamples = 4000;
  globalThis.calcChannels = [];
  globalThis.calcChannelWindow = 500;
  globalThis.numberOfAxes = 6;
}
