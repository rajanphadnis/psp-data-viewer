import { loader } from "./html_components";
import { update } from "./plotting/main";
import { clearDatums } from "./tools/measuring";
import { pspColors } from "./theming";
import { loadingStatus } from "./types";
import { updateStatus } from "./web_components";

export function writeSelectorList(datasets: string[]) {
  const selectorDiv = document.getElementById("dataset-selector")!;
  selectorDiv.innerHTML = "";
  for (let i = 0; i < datasets.length; i++) {
    const dataset: string = datasets[i];
    let buttonInnerHTML: string;
    let buttonColor: string;
    let list_text = document.createElement("p");
    let list_button = document.createElement("button");
    if (globalThis.activeDatasets_to_add.includes(dataset)) {
      buttonInnerHTML = globalThis.activeDatasets_legend_side[globalThis.activeDatasets_to_add.indexOf(dataset)];
      buttonColor = pspColors.aged;
      list_text.classList.toggle("available", false);
    } else if (globalThis.activeDatasets_loading.includes(dataset)) {
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
    list_text.innerHTML = dataset.toString().split("__")[0];
    list_button.innerHTML = buttonInnerHTML;
    list_button.style.backgroundColor = buttonColor;
    list_button.id = `datasetListLegendCycleButton_${dataset}`;
    list_div.appendChild(list_text);
    list_div.appendChild(list_button);
    selectorDiv.appendChild(list_div);
    list_text.addEventListener("click", async (e) => {
      await buttonClickHandler(dataset);
    });
    list_button.addEventListener("click", async (e) => {
      // if (document.getElementById(`datasetListLegendCycleButton_${dataset}`)!.innerHTML != "+") {
      //   const list_button_val = parseInt(document.getElementById(`datasetListLegendCycleButton_${dataset}`)!.innerHTML);
      //   let newVal = list_button_val + 1;
      //   if (newVal > 4) {
      //     newVal = 1;
      //   }
      //   globalThis.activeDatasets_legend_side[globalThis.activeDatasets_to_add.indexOf(dataset)] = newVal;
      //   await update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
      //   // document.getElementById(`datasetListLegendCycleButton_${dataset}`)!.innerHTML = newVal.toString();
      // } else {
      await buttonClickHandler(dataset);
      // }
    });
  }
}

export async function buttonClickHandler(dataset: string) {
  updateStatus(loadingStatus.LOADING);
  if (globalThis.activeDatasets_to_add.includes(dataset)) {
    const index = globalThis.activeDatasets_to_add.indexOf(dataset, 0);
    if (index > -1) {
      globalThis.activeDatasets_to_add.splice(index, 1);
    }
  } else if (globalThis.activeDatasets_loading.includes(dataset)) {
    console.log("data already loading!");
  } else {
    // globalThis.activeDatasets_legend_side[globalThis.activeDatasets_to_add.indexOf(dataset)] = 1;
    globalThis.activeDatasets_to_add.push(dataset);
  }
  clearDatums(globalThis.uplot);
  await update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
  updateStatus(loadingStatus.DONE);
}
