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
  updateStatus(loadingStatus.LOADING);
  const [tests, default_url] = await getGeneralTestInfo();
  setKnownTests(tests, default_url);
  globalThis.test_id = getTestID(default_url);
  getSharelinkList();
  const [datasets, name, test_article, gse_article, initial_timestamp] = await getTestInfo();
  globalThis.activeDatasets.all = datasets.sort((a, b) => a.localeCompare(b));
  setTitle(name, test_article, gse_article);
  setupEventListeners();
  update();
}

main();
