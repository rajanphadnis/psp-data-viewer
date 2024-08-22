import { httpsCallable } from "firebase/functions";
import { getSharelink, copyTextToClipboard, updateStatus, delay } from "./browser_fxns";
import { check_mark, loader } from "./html_components";
import { plotSnapshot } from "./image_tools";
import { loadingStatus } from "./types";

const sharelinkButton: HTMLButtonElement = document.getElementById("sharelinkButton")! as HTMLButtonElement;
const downloadImageButton: HTMLButtonElement = document.getElementById("downloadImage")! as HTMLButtonElement;
const copyImageButton: HTMLButtonElement = document.getElementById("copyImage")! as HTMLButtonElement;
const csvButton: HTMLButtonElement = document.getElementById("downloadCSV")! as HTMLButtonElement;
const resetButton: HTMLButtonElement = document.getElementById("resetCache")! as HTMLButtonElement;

export function setupEventListeners() {
  resetButton.addEventListener("click", async (e) => {
    updateStatus(loadingStatus.LOADING);
    localStorage.clear();
    sessionStorage.clear();
    const dbs = await window.indexedDB.databases();
    dbs.forEach(async (db) => {
      await window.indexedDB.deleteDatabase(db.name!);
    });
    const [link, b64] = getSharelink();
    window.location.href = link;
  });
  csvButton.addEventListener("click", async (e) => {
    updateStatus(loadingStatus.LOADING);
    csvButton.innerHTML = loader;
    const data_columns = JSON.parse(localStorage.getItem("currentData_data")!);
    const data_names = JSON.parse(localStorage.getItem("currentData_names")!);
    let csvData: any[][] = [[...data_names]];
    for (let i = 0; i < data_columns[0].length; i++) {
      let rowToWrite = [];
      for (let j = 0; j < data_columns.length; j++) {
        const element = data_columns[j][i];
        rowToWrite.push(element);
      }
      csvData.push(rowToWrite);
    }
    console.log(csvData);
    let csvContent = "data:text/csv;charset=utf-8," + csvData.map((e) => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link);
    link.click();
    updateStatus(loadingStatus.DONE);
    csvButton.innerHTML = check_mark;
    await delay(1500);
    csvButton.innerHTML = '<span class="material-symbols-outlined">csv</span>';
  });

  sharelinkButton.addEventListener("click", async (e) => {
    const [sharelink, b64]: [string, string] = getSharelink();
    copyTextToClipboard(sharelink);
    console.log(sharelink);
  });

  downloadImageButton.addEventListener("click", async (e) => {
    updateStatus(loadingStatus.LOADING);
    plotSnapshot("download");
    downloadImageButton.innerHTML = check_mark;
    updateStatus(loadingStatus.DONE);
    await delay(1500);
    downloadImageButton.innerHTML = '<span class="material-symbols-outlined">download</span>';
  });

  copyImageButton.addEventListener("click", async (e) => {
    updateStatus(loadingStatus.LOADING);
    plotSnapshot("copy");
    copyImageButton.innerHTML = check_mark;
    updateStatus(loadingStatus.DONE);
    await delay(1500);
    copyImageButton.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
  });
}

export function updateAvailableFeatures() {
  csvButton.style.opacity = "1";
  csvButton.disabled = false;
  csvButton.style.cursor = "pointer";

  sharelinkButton.style.opacity = "1";
  sharelinkButton.disabled = false;
  sharelinkButton.style.cursor = "pointer";

  if (globalThis.activeDatasets_to_add.length > 0) {
    copyImageButton.style.opacity = "1";
    copyImageButton.disabled = false;
    copyImageButton.style.cursor = "pointer";

    // sharelinkButton.style.opacity = "1";
    // sharelinkButton.disabled = false;
    // sharelinkButton.style.cursor = "pointer";

    downloadImageButton.style.opacity = "1";
    downloadImageButton.disabled = false;
    downloadImageButton.style.cursor = "pointer";

    // csvButton.style.opacity = "1";
    // csvButton.disabled = false;
    // csvButton.style.cursor = "pointer";
  } else {
    copyImageButton.style.opacity = "0";
    copyImageButton.disabled = true;
    copyImageButton.style.cursor = "default";

    // sharelinkButton.style.opacity = "0";
    // sharelinkButton.disabled = true;
    // sharelinkButton.style.cursor = "default";

    downloadImageButton.style.opacity = "0";
    downloadImageButton.disabled = true;
    downloadImageButton.style.cursor = "default";

    // csvButton.style.opacity = "0";
    // csvButton.disabled = true;
    // csvButton.style.cursor = "default";
  }
}
