import { Firestore } from "firebase/firestore";
import { getTestInfo, getGeneralTestInfo } from "./db_interaction";
import { update } from "./plotting";
import { loadingStatus } from "./types";
import { getTestID, getSharelinkList, setTitle, updateStatus } from "./browser_fxns";
import { initModal, initModalEscape, setKnownTests } from "./modal";
import { initFirebase } from "./firebase_init";
import type uPlot from "uplot";
import { setupEventListeners } from "./toolbar";
import { getFunctions, type Functions } from "firebase/functions";
import { initSettingsModal, setupSettings } from "./settings";
import { initColorList } from "./theming";

declare global {
  // var activeDatasets: DatasetStatus;
  var activeDatasets_to_add: string[];
  var activeDatasets_all: string[];
  var activeDatasets_loading: string[];
  var activeDatasets_cached: string[];
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
}
globalThis.activeDatasets_to_add = [];
globalThis.activeDatasets_all = [];
globalThis.activeDatasets_loading = [];
globalThis.activeDatasets_cached = [];
initColorList();
initFirebase();
initModal();
initSettingsModal();
initModalEscape();

async function main() {
  globalThis.displayedSamples = 4500;
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
