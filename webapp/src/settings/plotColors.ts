import { delete_icon } from "../html_components";
import { update } from "../plotting/main";
import { getDatasetPlottingColor, defaultPlottingColors, getPlottingColorListLength } from "../theming";
import { initColorPlotInputs } from "../modals/settingsModal";

export function createColorListItem(index: number, val: string): HTMLDivElement {
  const listDiv = document.createElement("div");
  const textInput = document.createElement("input");
  const deleteButton = document.createElement("button");
  listDiv.classList.add("url_list_div");
  listDiv.id = "url_list_div_" + index;
  textInput.id = "url_list_div_textinput_" + index;
  textInput.classList.add("test-field-text");
  textInput.classList.add("color-list-text-fields");
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

export function initColorList() {
  const saveButton = document.getElementById("save_color_pallet")!;
  const addButton = document.getElementById("addto_color_pallet")!;
  const resetButton = document.getElementById("reset_color_pallet")!;
  addButton.addEventListener("click", (e) => {
    const numberOfCurrentItems = document.getElementsByClassName("url_list_div").length;
    document
      .getElementById("colorPickerDiv")!
      .appendChild(createColorListItem(numberOfCurrentItems, getDatasetPlottingColor(numberOfCurrentItems)));
    initColorPlotInputs();
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

export function refreshColorListElements() {
  const mainDiv = document.getElementById("colorPickerDiv")!;
  mainDiv.innerHTML = "";
  for (let i = 0; i < getPlottingColorListLength(); i++) {
    mainDiv.appendChild(createColorListItem(i, getDatasetPlottingColor(i)));
  }
  initColorPlotInputs();
}

export function getColorList() {
  const inputFields = document.querySelectorAll(".color-list-text-fields")! as NodeListOf<HTMLInputElement>;
  let newColorList: string[] = [];
  inputFields.forEach((inputField) => {
    newColorList.push(inputField.value);
  });
  return newColorList;
}
