import { Firestore } from "firebase/firestore";
import { getTestInfo, getGeneralTestInfo } from "./db_interaction";
import { update } from "./plotting/main";
import { loadingStatus, type CalcChannel } from "./types";
import { getTestID, getSharelinkList, setTitle, addKeyPressListeners } from "./browser_interactions";
import { initSwitcherModal, setKnownTests } from "./modals/testSwitcherModal";
import { initModalEscape } from "./modals/general";
import { initFirebase } from "./firebase_init";
import uPlot from "uplot";
import { setupEventListeners } from "./toolbar";
import { type Functions } from "firebase/functions";
import { setupSettings } from "./settings/settings";
import { initColorList } from "./caching";
import {} from "./tools/measuring";
import { initGlobalVariables, updateStatus } from "./web_components";
import { initSettingsModal } from "./modals/settingsModal";
import { initToolsModal } from "./modals/toolModal";
import Coloris from "@melloware/coloris";

declare global {
  var activeDatasets_to_add: string[];
  var activeDatasets_all: string[];
  var activeDatasets_loading: string[];
  var activeDatasets_cached: string[];
  var activeDatasets_legend_side: number[];
  var test_id: string;
  var db: Firestore;
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var uplot: uPlot;
  var functions: Functions;
  var starting_timestamp: number;
  var ending_timestamp: number;
  var displayedSamples: number;
  var displayedRangeStart: number;
  var displayedRangeEnd: number;
  var plotPalletteColors: string[];
  var plotDisplayedAxes: string[];
  var x1: number | null;
  var x2: number | null;
  var y1: number[];
  var y2: number[];
  var measuringToolColor: string;
  var calcChannels: CalcChannel[];
  var calcChannelWindow: number;
}
initGlobalVariables();
globalThis.calcChannels.push({
  formula: "x+10",
  newChannelName: "fms_calc",
  axisSide: 1,
  units: "lbf",
  var_mapping: [
    {
      source_channel: "fms__lbf__",
      var_name: "x",
    },
  ],
});
globalThis.calcChannels.push({
  formula: "B+z",
  newChannelName: "fu_calc",
  axisSide: 2,
  units: "th",
  var_mapping: [
    {
      source_channel: "fu_psi__psi__",
      var_name: "z",
    },
    {
      source_channel: "fms__lbf__",
      var_name: "B",
    },
  ],
});
Coloris.init();
initColorList();
initFirebase();
initSwitcherModal();
initSettingsModal();
initToolsModal();
initModalEscape();
addKeyPressListeners();

async function main() {
  localStorage.removeItem("currentData_data");
  localStorage.removeItem("currentData_names");
  updateStatus(loadingStatus.LOADING);
  const [tests, default_url] = await getGeneralTestInfo();
  setKnownTests(tests, default_url);
  globalThis.test_id = getTestID(default_url);
  const usingSharelink: boolean = getSharelinkList();
  const [datasets, name, test_article, gse_article, starting_ts, ending_ts] = await getTestInfo();
  globalThis.starting_timestamp = starting_ts;
  globalThis.ending_timestamp = ending_ts;
  if (!usingSharelink) {
    globalThis.displayedRangeStart = starting_ts;
    globalThis.displayedRangeEnd = ending_ts;
  }
  globalThis.activeDatasets_all = datasets.sort((a, b) => a.localeCompare(b));
  setTitle(name, test_article, gse_article);
  setupEventListeners();
  setupSettings();
  update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
}

main();
