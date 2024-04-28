import { initializeApp } from "firebase/app";
import { Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { type AlignedData } from "uplot";
import { getSensorData, getTestInfo } from "./db_interaction";
import { legendRound, plot } from "./plotting_helpers";
import { plotDatasets } from "./plotting";

const firebaseConfig = {
  apiKey: "AIzaSyAmJytERQ1hnORHswd-j07WhpTYH7yu6fA",
  authDomain: "psp-portfolio-f1205.firebaseapp.com",
  projectId: "psp-portfolio-f1205",
  storageBucket: "psp-portfolio-f1205.appspot.com",
  messagingSenderId: "493859450932",
  appId: "1:493859450932:web:e4e3c67f0f46316c555a61",
};

const app = initializeApp(firebaseConfig);
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache(/*settings*/ { tabManager: persistentMultipleTabManager() }),
});

async function main() {
  const test_name: string = "short-duration-hotfire-1";

  const [datasets, name, test_article] = await getTestInfo(db, test_name);
  const titleElement = document.getElementById("title")!;
  const modButton = document.getElementById("addBtn")!;
  const plotDiv = document.getElementById("plot")!;
  const selectorDiv = document.getElementById("dataset-selector")!;
  titleElement.innerHTML = "PSP Data Viewer::" + test_article + "::" + name;
  modButton.style.display = "block";
  modButton.addEventListener("click", (e) => {});
  console.log(datasets);
  for (let i = 0; i < datasets.length; i++) {
    const dataset: string = datasets[i];
    const list_div = document.createElement("div");
    list_div.classList.add("datasetListDiv");
    let list_text = document.createElement("p");
    let list_button = document.createElement("button");
    list_text.innerHTML = dataset;
    list_button.innerHTML = "+";
    list_div.appendChild(list_text);
    list_div.appendChild(list_button);
    selectorDiv.appendChild(list_div);
  }
  // const datasets: string[] = ["pt-ox-02", "pt-fu-02"];
  await plotDatasets(db, test_name, datasets, datasets);
}

main();
