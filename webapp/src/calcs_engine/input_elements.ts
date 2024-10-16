import { delete_icon, plus_icon } from "../html_components";
import type { CalcChannel } from "../types";
import {
  createCalcChannelAxesSelector,
  createCalcChannelUnitsSelector,
  createCalcChannelVarSelector,
  createChannelDropdownElement,
} from "./dropdown_lists";

export function createChannelInputElement(
  calc_channel_index: number,
  calc_channel_input_index: number,
  parentDiv: HTMLDivElement,
  val_var_name: string | undefined = undefined,
  val_var_source: string | undefined = undefined
) {
  const div = document.createElement("div") as HTMLDivElement;
  const p1 = document.createElement("p") as HTMLParagraphElement;
  const pequal = document.createElement("p") as HTMLParagraphElement;
  const var_name = createCalcChannelVarSelector(calc_channel_index, val_var_name);
  const dropdown = createChannelDropdownElement(calc_channel_index, calc_channel_input_index, val_var_source);
  const deleteButton = document.createElement("button");

  div.appendChild(p1);
  div.appendChild(var_name);
  div.appendChild(pequal);
  div.appendChild(dropdown);
  div.appendChild(deleteButton);

  pequal.innerHTML = "=";
  p1.innerHTML = "Set variable source: ";

  div.classList.add("calcChannelInputDiv");

  deleteButton.innerHTML = delete_icon;
  deleteButton.classList.add("calc_channel_list_delete_button");
  deleteButton.setAttribute("title", "Delete Entry");
  deleteButton.addEventListener("click", (e) => {
    parentDiv.removeChild(div);
  });

  return div;
}
export function createCalcChannelMainItem(
  index: number,
  val: CalcChannel | undefined,
  subDiv: HTMLDivElement
): HTMLDivElement {
  const listDiv = document.createElement("div");
  const formulaP = document.createElement("p");
  const formulaInput = document.createElement("span");
  const formulaDiv = document.createElement("div");
  const nameP = document.createElement("p");
  const nameInput = document.createElement("input");
  const nameDiv = document.createElement("div");
  const unitsP = document.createElement("p");
  const unitsDiv = document.createElement("div");
  const axisP = document.createElement("p");
  const axisDiv = document.createElement("div");
  const deleteButton = document.createElement("button");
  const addButton = document.createElement("button");
  listDiv.classList.add("calc_channel_list_div");
  nameInput.classList.add("calc-channels-name");
  nameInput.classList.add("calc-channel-list-text-fields");
  formulaInput.classList.add("calc-channels-formula");
  formulaInput.classList.add("calc-channel-list-text-fields");
  formulaInput.setAttribute("title", "Calc Channel Formula Input Box");
  nameInput.setAttribute("title", "Calc Channel Name Input Box");
  nameInput.setAttribute("type", "text");
  nameInput.value = val == undefined ? "" : val.newChannelName;
  deleteButton.innerHTML = delete_icon;
  deleteButton.classList.add("calc_channel_list_delete_button");
  deleteButton.setAttribute("title", "Delete Entry");
  addButton.innerHTML = plus_icon;
  addButton.classList.add("calc_channel_list_add_button");
  addButton.setAttribute("title", "Delete Entry");

  nameP.innerText = "Name:";
  formulaP.innerText = "Formula:";
  unitsP.innerText = "Units:";
  axisP.innerText = "Axis:";

  nameDiv.appendChild(nameP);
  nameDiv.appendChild(nameInput);
  listDiv.appendChild(nameDiv);
  formulaDiv.appendChild(formulaP);
  formulaDiv.appendChild(formulaInput);
  listDiv.appendChild(formulaDiv);
  unitsDiv.appendChild(unitsP);
  unitsDiv.appendChild(createCalcChannelUnitsSelector(index, val == undefined ? "psi" : val.units));
  listDiv.appendChild(unitsDiv);
  axisDiv.appendChild(axisP);
  axisDiv.appendChild(createCalcChannelAxesSelector(index, val == undefined ? 1 : val.axisSide));
  listDiv.appendChild(axisDiv);
  listDiv.appendChild(addButton);
  listDiv.appendChild(deleteButton);
  deleteButton.addEventListener("click", (e) => {
    const hrAbove = listDiv.previousElementSibling;
    hrAbove!.remove();
    document.getElementById("calcChannelDiv")!.removeChild(listDiv);
    document.getElementById("calcChannelDiv")!.removeChild(subDiv);
  });
  addButton.addEventListener("click", (e) => {
    const numberOfCurrentItems = document.getElementsByClassName("calcChannelInputDiv").length;
    subDiv.appendChild(createChannelInputElement(index, numberOfCurrentItems, subDiv, undefined, undefined));
  });
  return listDiv;
}
