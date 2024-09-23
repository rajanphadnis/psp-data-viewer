import { getDefaultMeasuringToolColor } from "./caching";
import { check_mark, loader } from "./html_components";
import { loadingStatus } from "./types";

/**
 * Updates the displayed state of the app to either `loadingStatus.LOADING` or `loadingStatus.DONE`
 *
 * @param status what to set the current status to. Of type {@link loadingStatus}
 * @returns None
 *
 */
export function updateStatus(status: loadingStatus) {
  if (status == loadingStatus.LOADING) {
    // Update status div to show loading circle
    document.getElementById("status")!.innerHTML = loader;
  }
  if (status == loadingStatus.DONE) {
    // Update status div to show green check mark
    document.getElementById("status")!.innerHTML = check_mark;
  }
}

/**
 * Initializes the app state on first page load
 *
 * @returns None
 *
 */
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
  globalThis.calcChannelWindow = 1;
  globalThis.numberOfAxes = 6;
}
