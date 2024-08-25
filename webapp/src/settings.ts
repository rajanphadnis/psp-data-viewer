import Coloris from "@melloware/coloris";
import { getSharelink, updateStatus } from "./browser_fxns";
import { appVersion, buildDate } from "./generated_app_info";
import { loadingStatus } from "./types";
import { defaultPlottingColors, getColorList, getDatasetPlottingColor, getPlottingColorListLength } from "./theming";
import { update } from "./plotting";

const plus_icon =
  '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#000000" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>';

const delete_icon =
  '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>';

const save_icon =
  '<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>';

const resetButton: HTMLButtonElement = document.getElementById("resetCache")! as HTMLButtonElement;
const docsButton: HTMLButtonElement = document.getElementById("openDocs")! as HTMLButtonElement;
const adminButton: HTMLButtonElement = document.getElementById("openAdmin")! as HTMLButtonElement;
const metadataButton: HTMLButtonElement = document.getElementById("resetMetadata")! as HTMLButtonElement;
export function initSettingsModal() {
  const modal = document.getElementById("settingsModal")!;
  const settings_versionString = document.getElementById("settings_versionString")! as HTMLSpanElement;
  const settings_buildDate = document.getElementById("settings_buildDate")! as HTMLSpanElement;
  const settings_releaseNotesLink = document.getElementById("settings_releaseNotesLink")! as HTMLLinkElement;
  const settingsButton = document.getElementById("settings-button")!;
  const closeButton = document.getElementById("settingsClose")!;
  settingsButton.addEventListener("click", (e) => {
    modal.style.display = "block";
    Coloris.init();
    Coloris({
      el: ".test-field-text",
      swatches: defaultPlottingColors,
      alpha: false,
      format: "hex",
      themeMode: "dark",
    });
  });

  closeButton.addEventListener("click", (e) => {
    modal.style.display = "none";
  });
  settings_versionString.innerText = appVersion;
  settings_buildDate.innerText = buildDate;
  settings_releaseNotesLink.href = `https://github.com/rajanphadnis/psp-data-viewer/releases/tag/${appVersion}`;
}

export function setupSettings() {
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

function initColorList() {
  const saveButton = document.getElementById("save_color_pallet")!;
  const addButton = document.getElementById("addto_color_pallet")!;
  const resetButton = document.getElementById("reset_color_pallet")!;
  addButton.addEventListener("click", (e) => {
    const numberOfCurrentItems = document.getElementsByClassName("url_list_div").length;
    document
      .getElementById("colorPickerDiv")!
      .appendChild(createColorListItem(numberOfCurrentItems, getDatasetPlottingColor(numberOfCurrentItems)));
    Coloris.init();
    Coloris({
      el: ".test-field-text",
      swatches: defaultPlottingColors,
      alpha: false,
      format: "hex",
      themeMode: "dark",
    });
  });
  saveButton.addEventListener("click", (e) => {
    let newList = getColorList();
    localStorage.setItem("plotting_color_pallette_color_list", JSON.stringify(newList));
    globalThis.plotPalletteColors = newList;
    update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
  });
  resetButton.addEventListener("click", (e) => {
    localStorage.setItem("plotting_color_pallette_color_list", JSON.stringify(defaultPlottingColors));
    globalThis.plotPalletteColors = defaultPlottingColors;
    update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
    refreshColorListElements();
  });
}

function refreshColorListElements() {
  const mainDiv = document.getElementById("colorPickerDiv")!;
  mainDiv.innerHTML = "";
  for (let i = 0; i < getPlottingColorListLength(); i++) {
    mainDiv.appendChild(createColorListItem(i, getDatasetPlottingColor(i)));
  }
  Coloris.init();
    Coloris({
      el: ".test-field-text",
      swatches: defaultPlottingColors,
      alpha: false,
      format: "hex",
      themeMode: "dark",
    });
}

function createColorListItem(index: number, val: string): HTMLDivElement {
  const listDiv = document.createElement("div");
  const textInput = document.createElement("input");
  const deleteButton = document.createElement("button");
  listDiv.classList.add("url_list_div");
  listDiv.id = "url_list_div_" + index;
  textInput.id = "url_list_div_textinput_" + index;
  textInput.classList.add("test-field-text");
  // let attr = document.createAttribute("data-coloris");
  // textInput.setAttributeNode(attr);
  textInput.setAttribute("title", "Color Picker Text Input Box");
  textInput.setAttribute("type", "text");
  textInput.value = val;
  deleteButton.innerHTML = delete_icon;
  deleteButton.classList.add("url_list_delete_button");
  deleteButton.setAttribute("title", "Delete Entry");
  listDiv.appendChild(textInput);
  listDiv.appendChild(deleteButton);
  deleteButton.addEventListener("click", (e) => {
    document.getElementById("colorPickerDiv")!.removeChild(listDiv);
  });
  return listDiv;
}
