import { delete_icon } from "../html_components";
import { update } from "../plotting/main";

export function createCalcChannelItem(index: number, val: string): HTMLDivElement {
  const listDiv = document.createElement("div");
  const formulaInput = document.createElement("span");
  const nameInput = document.createElement("input");
  const deleteButton = document.createElement("button");
  listDiv.classList.add("calc_channel_list_div");
  listDiv.id = "calc_channel_list_div_" + index;
  nameInput.id = "calc_channel_list_div_textinput_name_" + index;
  nameInput.classList.add("calc-channels-name");
  nameInput.classList.add("calc-channel-list-text-fields");
  formulaInput.id = "calc_channel_list_div_textinput_" + index;
  formulaInput.classList.add("calc-channels-formula");
  formulaInput.classList.add("calc-channel-list-text-fields");
  formulaInput.setAttribute("title", "Calc Channel Formula Input Box");
  // formulaInput.setAttribute("type", "text");
  nameInput.setAttribute("title", "Calc Channel Name Input Box");
  nameInput.setAttribute("type", "text");
  // formulaInput.value = val;
  nameInput.value = "name";
  deleteButton.innerHTML = delete_icon;
  deleteButton.classList.add("calc_channel_list_delete_button");
  deleteButton.setAttribute("title", "Delete Entry");
  listDiv.appendChild(nameInput);
  listDiv.appendChild(formulaInput);
  listDiv.appendChild(deleteButton);
  deleteButton.addEventListener("click", (e) => {
    document.getElementById("calcChannelDiv")!.removeChild(listDiv);
  });
  
  return listDiv;
}

export function initCalcChannelList() {
  const saveButton = document.getElementById("save_calc_channels")!;
  const addButton = document.getElementById("addto_calc_channels")!;
  const resetButton = document.getElementById("reset_calc_channels")!;
  addButton.addEventListener("click", (e) => {
    const numberOfCurrentItems = document.getElementsByClassName("calc-channels-formula").length;
    document.getElementById("calcChannelDiv")!.appendChild(createCalcChannelItem(numberOfCurrentItems, ""));
    const formulaInput = document.getElementById("calc_channel_list_div_textinput_" + numberOfCurrentItems)!;
    const config = {
      handlers: {
        edit: function() {
          let enteredMath = formulaInput.latex(); // Get entered math in LaTeX format
          // checkAnswer(enteredMath);
          console.log(enteredMath);
        }
      },
      restrictMismatchedBrackets: true,
    };
    let mathField = MathQuill.getInterface(2).MathField(formulaInput, config);
    console.log(mathField);
  });
  saveButton.addEventListener("click", (e) => {
    //   let newList = getColorList();
    //   localStorage.setItem("plotting_color_pallette_color_list", JSON.stringify(newList));
    //   globalThis.plotPalletteColors = newList;
    update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
  });
  // resetButton.addEventListener("click", (e) => {
  //   localStorage.setItem("plotting_color_pallette_color_list", JSON.stringify(defaultPlottingColors));
  //   globalThis.plotPalletteColors = defaultPlottingColors;
  //   update(globalThis.displayedRangeStart, globalThis.displayedRangeEnd);
  //   refreshColorListElements();
  // });
}
