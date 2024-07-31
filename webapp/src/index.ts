import { Firestore } from "firebase/firestore";
import { getTestInfo, getGeneralTestInfo } from "./db_interaction";
import { update } from "./plotting";
import { loadingStatus, type DatasetStatus } from "./types";
import { getTestID, getSharelinkList, setTitle, updateStatus, getAWSTokens as initAWS } from "./browser_fxns";
import { initModal, setKnownTests } from "./modal";
import { initFirebase } from "./firebase_init";
import type uPlot from "uplot";
import { setupEventListeners } from "./toolbar";
import { getFunctions, type Functions } from "firebase/functions";
import type { TimestreamQueryClient } from "@aws-sdk/client-timestream-query";

declare global {
  var activeDatasets: DatasetStatus;
  var test_id: string;
  var db: Firestore;
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var uplot: uPlot;
  var functions: Functions;
  var aws_auth: any;
  var aws_jwt: any;
  var timestreamQuery: TimestreamQueryClient;
  var starting_timestamp: number;
  var ending_timestamp: number;
  var displayedSamples: number;
  var displayedRangeStart: number;
  var displayedRangeEnd: number;
}
globalThis.activeDatasets = {
  to_add: [],
  loading: [],
  cached: [],
  all: [],
};

initAWS();
initFirebase();
initModal();

async function main() {
  globalThis.displayedSamples = 3000;
  updateStatus(loadingStatus.LOADING);
  const [tests, default_url] = await getGeneralTestInfo();
  setKnownTests(tests, default_url);
  globalThis.test_id = getTestID(default_url);
  getSharelinkList();
  const [datasets, name, test_article, gse_article, starting_ts, ending_ts] = await getTestInfo();
  globalThis.starting_timestamp = starting_ts;
  globalThis.ending_timestamp = ending_ts;
  globalThis.displayedRangeStart = starting_ts;
  globalThis.displayedRangeEnd = ending_ts;
  globalThis.activeDatasets.all = datasets.sort((a, b) => a.localeCompare(b));
  setTitle(name, test_article, gse_article);
  setupEventListeners();
  update();
}

main();
