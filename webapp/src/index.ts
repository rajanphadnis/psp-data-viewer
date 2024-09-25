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
import { setupSettings } from "./settings/settings";
import { initCalcChannels, initColorList } from "./caching";
import { initGlobalVariables, updateStatus } from "./web_components";
import { initSettingsModal } from "./modals/settingsModal";
import { initToolsModal } from "./modals/toolModal";
import Coloris from "@melloware/coloris";

// Initialize global state variables. All of these variables
// hold the current state of the web app.
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
  var calcChannelDt_seconds: number;
  var numberOfAxes: number;
}

// When the page is loaded, initialize the global variables (the app state)
initGlobalVariables();

// Initialize the color picker plugin
Coloris.init();

// Initialize the plotting color pallette
initColorList();

// Initialize Firebase services and authorize with Firebase App Check  
initFirebase();

// Initialize the test switcher panel (modal)
initSwitcherModal();

// Initialize the settings modal
initSettingsModal();

// Initialize the calc channels from cache or init to an empty list
initCalcChannels();

// @ts-expect-error
var isChromium = !!navigator.userAgentData && navigator.userAgentData.brands.some((data) => data.brand == "Chromium");
if (!isChromium) {
  const message =
    "This site may not work properly on your browser. Please use a Chromium-based browser for the best experience\n\nRecommended Browsers: Google Chrome or Microsoft Edge";
  console.warn(message);
  alert(message);
}

// This is the main app run loop
async function main() {
  // Set the status to "Loading"
  updateStatus(loadingStatus.LOADING);

  // Clear the currently active datasets from the cache. These exist
  // if the user has visited the website before
  localStorage.removeItem("currentData_data");
  localStorage.removeItem("currentData_names");

  // Contact the Firestore database and get the default test data
  const [tests, default_url] = await getGeneralTestInfo();

  // 
  setKnownTests(tests, default_url);

  // get the currently selected test ID (or redirect to default test if it doesn't exist)
  globalThis.test_id = getTestID(default_url);

  // 
  const usingSharelink: boolean = getSharelinkList();

  // 
  const [datasets, name, test_article, gse_article, starting_ts, ending_ts] = await getTestInfo();
  globalThis.starting_timestamp = starting_ts;
  globalThis.ending_timestamp = ending_ts;
  if (!usingSharelink) {
    globalThis.displayedRangeStart = starting_ts;
    globalThis.displayedRangeEnd = ending_ts;
  }
  globalThis.activeDatasets_all = datasets.sort((a, b) => a.localeCompare(b));
  initToolsModal();
  initModalEscape();
  addKeyPressListeners();
  setTitle(name, test_article, gse_article);
  setupEventListeners();
  setupSettings();
  update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
}

// Run the app
main();
