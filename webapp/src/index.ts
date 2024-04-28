import { initializeApp } from "firebase/app";
import { Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getTestInfo, getGeneralTestInfo } from "./db_interaction";
import { update } from "./plotting";
import type { DatasetStatus } from "./types";
import { copyTextToClipboard, getSharelink, getTestName, initAdded } from "./browser_fxns";
import { loader } from "./html_components";
import { initModal, setKnownTests } from "./modal";

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

initModal();

async function main() {
  document.getElementById("status")!.innerHTML = loader;
  const [tests, default_url] = await getGeneralTestInfo();
  setKnownTests(tests, default_url);
  test_name = getTestName(default_url);
  initAdded();
  const [datasets, name, test_article] = await getTestInfo();
  activeDatasets.all = datasets.sort((a, b) => a.localeCompare(b));
  const titleElement = document.getElementById("title")!;
  const sharelinkButton = document.getElementById("sharelinkButton")!;
  const plotDiv = document.getElementById("plot")!;
  const selectorDiv = document.getElementById("dataset-selector")!;
  const tabTitle = document.getElementById("tabTitle")!;
  titleElement.innerHTML = "PSP Data Viewer::" + test_article + "::" + name;
  tabTitle.innerHTML = test_article + "::" + name;
  sharelinkButton.style.opacity = "1";
  sharelinkButton.addEventListener("click", async (e) => {
    const sharelink: string = getSharelink();
    copyTextToClipboard(sharelink);
    console.log(sharelink);
  });
  update();
}

main();
