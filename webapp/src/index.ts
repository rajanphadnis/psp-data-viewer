import { initializeApp } from "firebase/app";
import { Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { type AlignedData } from "uplot";
import { getSensorData, getTestInfo, getTestList } from "./db_interaction";
import { legendRound, plot } from "./plotting_helpers";
import { plotDatasets, update } from "./plotting";
import { writeSelectorList } from "./dataset_selector";
import type { DatasetStatus } from "./types";
import { copyTextToClipboard, getSharelink, getTestName, initAdded } from "./browser_fxns";

const firebaseConfig = {
  apiKey: "AIzaSyAmJytERQ1hnORHswd-j07WhpTYH7yu6fA",
  authDomain: "psp-portfolio-f1205.firebaseapp.com",
  projectId: "psp-portfolio-f1205",
  storageBucket: "psp-portfolio-f1205.appspot.com",
  messagingSenderId: "493859450932",
  appId: "1:493859450932:web:e4e3c67f0f46316c555a61",
};

const app = initializeApp(firebaseConfig);
declare global {
  var activeDatasets: DatasetStatus;
  var test_name: string;
  var db: Firestore;
}
db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
activeDatasets = {
  to_add: [],
  loading: [],
  cached: [],
  all: [],
};
test_name = getTestName();
initAdded();

async function main() {
  const [datasets, name, test_article] = await getTestInfo();
  activeDatasets.all = datasets;
  const titleElement = document.getElementById("title")!;
  const modButton = document.getElementById("addBtn")!;
  const plotDiv = document.getElementById("plot")!;
  const selectorDiv = document.getElementById("dataset-selector")!;
  titleElement.innerHTML = "PSP Data Viewer::" + test_article + "::" + name;
  modButton.style.display = "block";
  modButton.addEventListener("click", async (e) => {
    const sharelink: string = getSharelink();
    copyTextToClipboard(sharelink);
    console.log(sharelink);
  });
  update();
}

main();
