import { getSharelink, copyTextToClipboard, updateStatus, delay } from "./browser_fxns";
import { check_mark } from "./html_components";
import { plotSnapshot } from "./image_tools";
import { loadingStatus } from "./types";

const sharelinkButton: HTMLButtonElement = document.getElementById("sharelinkButton")! as HTMLButtonElement;
const downloadImageButton: HTMLButtonElement = document.getElementById("downloadImage")! as HTMLButtonElement;
const copyImageButton: HTMLButtonElement = document.getElementById("copyImage")! as HTMLButtonElement;
const csvButton: HTMLButtonElement = document.getElementById("downloadCSV")! as HTMLButtonElement;

export function setupEventListeners() {
  sharelinkButton.addEventListener("click", async (e) => {
    const sharelink: string = getSharelink();
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

export function updateFeatures() {
  // csvButton.style.opacity = "1";
  // csvButton.disabled = false;
  // csvButton.style.cursor = "pointer";

  sharelinkButton.style.opacity = "1";
  sharelinkButton.disabled = false;
  sharelinkButton.style.cursor = "pointer";

  if (activeDatasets.to_add.length > 0) {
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
