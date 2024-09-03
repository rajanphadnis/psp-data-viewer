import { saveCalcChannels } from "../caching";
import { toggleToolsModal } from "../modals/toolModal";
import { update } from "../plotting/main";
import type { CalcChannel } from "../types";
import { createCalcChannelMainItem, createChannelInputElement } from "./input_elements";

function addNewCalcChannelItems(val: CalcChannel | undefined) {
  const numberOfCurrentItems = document.getElementsByClassName("calc-channels-formula").length;
  const calcChannelSubDiv = document.createElement("div") as HTMLDivElement;
  calcChannelSubDiv.classList.add("calcChannelSubDiv");
  const hr = document.createElement("hr");
  document.getElementById("calcChannelDiv")!.appendChild(hr);
  document
    .getElementById("calcChannelDiv")!
    .appendChild(createCalcChannelMainItem(numberOfCurrentItems, val, calcChannelSubDiv));
  document.getElementById("calcChannelDiv")!.appendChild(calcChannelSubDiv);
  if (val == undefined) {
    calcChannelSubDiv.appendChild(
      createChannelInputElement(numberOfCurrentItems, numberOfCurrentItems, calcChannelSubDiv, undefined, undefined)
    );
  } else {
    val.var_mapping.forEach((var_map) => {
      calcChannelSubDiv.appendChild(
        createChannelInputElement(
          numberOfCurrentItems,
          numberOfCurrentItems,
          calcChannelSubDiv,
          var_map.var_name,
          var_map.source_channel
        )
      );
    });
  }
  const formulaInput = document.getElementsByClassName("calc-channels-formula")![numberOfCurrentItems];
  // @ts-ignore: Unreachable code error
  let mathField = MathQuill.getInterface(2).MathField(formulaInput, {
    restrictMismatchedBrackets: true,
    leftRightIntoCmdGoes: "up",
    supSubsRequireOperand: true,
    autoCommands: "pi theta sqrt sum",
    autoOperatorNames: "sin cos",
  });
  if (val != undefined) {
    mathField.latex(val.formula);
  }
}

export function initCalcChannelList() {
  const saveButton = document.getElementById("save_calc_channels")!;
  const addButton = document.getElementById("addto_calc_channels")!;
  const resetButton = document.getElementById("reset_calc_channels")!;
  addButton.addEventListener("click", (e) => {
    addNewCalcChannelItems(undefined);
  });
  saveButton.addEventListener("click", (e) => {
    const newList = getCalcChannelsConfig();
    saveCalcChannels(newList);
    globalThis.calcChannels = newList;
    toggleToolsModal();
    update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
  });
  resetButton.addEventListener("click", (e) => {
    localStorage.removeItem("calc_channels");
    globalThis.calcChannels = [];
    document.getElementById("calcChannelDiv")!.innerHTML = "";
    update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
  });
  redrawCalcChannelsList();
}

export function redrawCalcChannelsList() {
  document.getElementById("calcChannelDiv")!.innerHTML = "";
  globalThis.calcChannels.forEach((calcChannel) => {
    addNewCalcChannelItems(calcChannel);
  });
}

export function getCalcChannelsConfig() {
  const nameElements: HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName(
    "calc-channels-name"
  )! as HTMLCollectionOf<HTMLInputElement>;
  const formulaElements: HTMLCollectionOf<HTMLSpanElement> = document.getElementsByClassName(
    "calc-channels-formula"
  )! as HTMLCollectionOf<HTMLSpanElement>;
  const axisElements: HTMLCollectionOf<HTMLSelectElement> = document.getElementsByClassName(
    "calc_channel_axis_dropdown"
  )! as HTMLCollectionOf<HTMLSelectElement>;
  const unitsElements: HTMLCollectionOf<HTMLSelectElement> = document.getElementsByClassName(
    "calc_channel_units_dropdown"
  )! as HTMLCollectionOf<HTMLSelectElement>;
  const varSourceElements: HTMLCollectionOf<HTMLSelectElement> = document.getElementsByClassName(
    "calc_channel_var_source_dropdown"
  )! as HTMLCollectionOf<HTMLSelectElement>;
  const varNameElements: HTMLCollectionOf<HTMLSelectElement> = document.getElementsByClassName(
    "calc_channel_var_name_dropdown"
  )! as HTMLCollectionOf<HTMLSelectElement>;
  const subDivElements: HTMLCollectionOf<HTMLDivElement> = document.getElementsByClassName(
    "calcChannelSubDiv"
  )! as HTMLCollectionOf<HTMLDivElement>;
  let processedVars: number = 0;
  let toReturn = [];
  for (let i = 0; i < nameElements.length; i++) {
    const nameElement = nameElements[i].value;
    const formulaElement = formulaElements[i];
    // @ts-ignore: Unreachable code error
    const mathField = MathQuill.getInterface(2).MathField(formulaElement);
    const formulaVal = mathField.latex();
    const axisElement = axisElements[i].value;
    const unitsElement = unitsElements[i].value;
    const numberOfVars = subDivElements[i].children.length;
    let varElems = [];
    for (let j = 0; j < numberOfVars; j++) {
      const varSourceElement = varSourceElements[j + processedVars].value;
      const varNameElement = varNameElements[j + processedVars].value;
      let varElem = { var_name: varNameElement, source_channel: varSourceElement };
      varElems.push(varElem);
    }
    processedVars = processedVars + numberOfVars;
    const config: CalcChannel = {
      formula: formulaVal,
      newChannelName: nameElement,
      axisSide: parseInt(axisElement),
      units: unitsElement,
      var_mapping: varElems,
    };
    console.log(config);
    toReturn.push(config);
  }
  return toReturn;
}
