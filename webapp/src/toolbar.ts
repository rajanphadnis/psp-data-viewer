import { getSharelink, copyTextToClipboard, delay } from "./browser_interactions";
import { check_mark, loader } from "./html_components";
import { plotSnapshot } from "./tools/image_tools";
import { loadingStatus } from "./types";
import { downloadCSV } from "./tools/csv";
import { updateStatus } from "./web_components";
import { toggleToolsModal } from "./modals/toolModal";

const sharelinkButton: HTMLButtonElement = document.getElementById("sharelinkButton")! as HTMLButtonElement;
const downloadImageButton: HTMLButtonElement = document.getElementById("downloadImage")! as HTMLButtonElement;
const copyImageButton: HTMLButtonElement = document.getElementById("copyImage")! as HTMLButtonElement;
const csvButton: HTMLButtonElement = document.getElementById("downloadCSV")! as HTMLButtonElement;
const measureButton: HTMLButtonElement = document.getElementById("measurePlotButton")! as HTMLButtonElement;
const calcChannelsButton: HTMLButtonElement = document.getElementById("calcChannelsButton")! as HTMLButtonElement;

export function setupEventListeners() {
  measureButton.addEventListener("click", (e) => {
    var popup = document.getElementById("measurementPopup")!;
    popup.classList.toggle("show");
  });
  calcChannelsButton.addEventListener("click", (e) => {
    toggleToolsModal();
  });
  csvButton.addEventListener("click", async (e) => {
    updateStatus(loadingStatus.LOADING);
    csvButton.innerHTML = loader;
    downloadCSV();
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
  // csvButton.style.opacity = "1";
  // csvButton.disabled = false;
  // csvButton.style.cursor = "pointer";

  sharelinkButton.style.opacity = "1";
  sharelinkButton.disabled = false;
  sharelinkButton.style.cursor = "pointer";

  if (globalThis.activeDatasets_to_add.length > 0) {
    copyImageButton.style.opacity = "1";
    copyImageButton.disabled = false;
    copyImageButton.style.cursor = "pointer";

    measureButton.style.opacity = "1";
    measureButton.disabled = false;
    measureButton.style.cursor = "pointer";

    calcChannelsButton.style.opacity = "1";
    calcChannelsButton.disabled = false;
    calcChannelsButton.style.cursor = "pointer";

    downloadImageButton.style.opacity = "1";
    downloadImageButton.disabled = false;
    downloadImageButton.style.cursor = "pointer";

    csvButton.style.opacity = "1";
    csvButton.disabled = false;
    csvButton.style.cursor = "pointer";
  } else {
    copyImageButton.style.opacity = "0";
    copyImageButton.disabled = true;
    copyImageButton.style.cursor = "default";

    measureButton.style.opacity = "0";
    measureButton.disabled = true;
    measureButton.style.cursor = "default";

    calcChannelsButton.style.opacity = "0";
    calcChannelsButton.disabled = true;
    calcChannelsButton.style.cursor = "default";

    downloadImageButton.style.opacity = "0";
    downloadImageButton.disabled = true;
    downloadImageButton.style.cursor = "default";

    csvButton.style.opacity = "0";
    csvButton.disabled = true;
    csvButton.style.cursor = "default";
  }
}
