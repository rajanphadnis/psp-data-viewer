import { getSharelink } from "../browser_interactions";
import { loadingStatus } from "../types";
import { updateStatus } from "../web_components";
import { initColorList, refreshColorListElements } from "./plotColors";

export function setupSettings() {
  const resetButton: HTMLButtonElement = document.getElementById("resetCache")! as HTMLButtonElement;
  const docsButton: HTMLButtonElement = document.getElementById("openDocs")! as HTMLButtonElement;
  const adminButton: HTMLButtonElement = document.getElementById("openAdmin")! as HTMLButtonElement;
  const metadataButton: HTMLButtonElement = document.getElementById("resetMetadata")! as HTMLButtonElement;
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
  metadataButton.addEventListener("click", async (e) => {
    updateStatus(loadingStatus.LOADING);
    const dbs = await window.indexedDB.databases();
    dbs.forEach(async (db) => {
      await window.indexedDB.deleteDatabase(db.name!);
    });
    const [link, b64] = getSharelink();
    window.location.href = link;
  });
  docsButton.addEventListener("click", (e) => {
    window.open("https://psp-docs.rajanphadnis.com/", "_blank");
  });
  adminButton.addEventListener("click", (e) => {
    window.open("https://psp-admin.rajanphadnis.com/", "_blank");
  });
  initColorList();
  refreshColorListElements();
}
