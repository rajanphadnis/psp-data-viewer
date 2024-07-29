import { updateStatus } from "./browser_fxns";
import { loader, check_mark } from "./html_components";
import { update } from "./plotting";
import { pspColors } from "./theming";
import { loadingStatus } from "./types";

export function writeSelectorList(datasets: string[]) {
  const selectorDiv = document.getElementById("dataset-selector")!;
  selectorDiv.innerHTML = "";
  for (let i = 0; i < datasets.length; i++) {
    const dataset: string = datasets[i];
    const dataset_public_name: string = dataset.split("__")[0] + " (" + dataset.split("__")[1] + ")"
    let buttonInnerHTML: string;
    let buttonColor: string;
    let list_text = document.createElement("p");
    let list_button = document.createElement("button");
    if (globalThis.activeDatasets.to_add.includes(dataset)) {
      buttonInnerHTML = "-";
      buttonColor = pspColors.aged;
      list_text.classList.toggle("available", false);
    } else if (globalThis.activeDatasets.loading.includes(dataset)) {
      buttonInnerHTML = loader;
      buttonColor = pspColors["night-sky"];
    } else {
      buttonInnerHTML = "+";
      buttonColor = pspColors.rush;
      list_text.classList.toggle("available", true);
    }
    const list_div = document.createElement("div");
    list_div.classList.add("datasetListDiv");
    list_button.classList.add("datasetListButton");
    list_text.innerHTML = dataset_public_name;
    list_button.innerHTML = buttonInnerHTML;
    list_button.style.backgroundColor = buttonColor;
    list_div.appendChild(list_text);
    list_div.appendChild(list_button);
    selectorDiv.appendChild(list_div);
    list_text.addEventListener("click", async (e) => {
      await buttonClickHandler(dataset);
    });
    list_button.addEventListener("click", async (e) => {
      await buttonClickHandler(dataset);
    });
  }
}

export async function buttonClickHandler(dataset: string) {
  updateStatus(loadingStatus.LOADING);
  if (globalThis.activeDatasets.to_add.includes(dataset)) {
    const index = globalThis.activeDatasets.to_add.indexOf(dataset, 0);
    if (index > -1) {
      globalThis.activeDatasets.to_add.splice(index, 1);
    }
  } else if (globalThis.activeDatasets.loading.includes(dataset)) {
    console.log("data already loading!");
  } else {
    globalThis.activeDatasets.to_add.push(dataset);
  }
  await update();
  updateStatus(loadingStatus.DONE);
}
