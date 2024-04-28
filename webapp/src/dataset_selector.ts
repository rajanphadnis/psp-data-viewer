import { update } from "./plotting";


export function writeSelectorList(datasets: string[]) {
  const selectorDiv = document.getElementById("dataset-selector")!;
  selectorDiv.innerHTML = "";
  for (let i = 0; i < datasets.length; i++) {
    const dataset: string = datasets[i];
    let buttonInnerHTML: string;
    if (activeDatasets.to_add.includes(dataset)) {
      buttonInnerHTML = "-";
    } else if (activeDatasets.loading.includes(dataset)) {
      buttonInnerHTML = "l";
    } else {
      buttonInnerHTML = "+";
    }
    const list_div = document.createElement("div");
    list_div.classList.add("datasetListDiv");
    let list_text = document.createElement("p");
    let list_button = document.createElement("button");
    list_text.innerHTML = dataset;
    list_button.innerHTML = buttonInnerHTML;
    list_div.appendChild(list_text);
    list_div.appendChild(list_button);
    selectorDiv.appendChild(list_div);
    list_button.addEventListener("click", async (e) => {
      await buttonClickHandler(dataset);
    });
  }
}

export async function buttonClickHandler(dataset: string) {
  if (activeDatasets.to_add.includes(dataset)) {
    const index = activeDatasets.to_add.indexOf(dataset, 0);
    if (index > -1) {
      activeDatasets.to_add.splice(index, 1);
    }
  } else if (activeDatasets.loading.includes(dataset)) {
    console.log("data already loading!");
  } else {
    activeDatasets.to_add.push(dataset);
  }
  await update();
}
