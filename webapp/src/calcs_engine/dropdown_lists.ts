import { alphabet, unitsList } from "./random";

export function createChannelDropdownElement(
  calc_channel_index: number,
  calc_channel_input_index: number,
  val: string | undefined
) {
  const select = document.createElement("select") as HTMLSelectElement;
  select.name = `${calc_channel_index}_${calc_channel_input_index}`;
  // select.id = `select_${calc_channel_index}_${calc_channel_input_index}`;
  select.classList.add("calc_channel_var_source_dropdown");
  globalThis.activeDatasets_all.forEach((dataset) => {
    const option = document.createElement("option") as HTMLOptionElement;
    option.value = dataset;
    option.innerHTML = dataset.split("__")[0];
    select.appendChild(option);
  });
  if (val != undefined) {
    select.value = val;
  }
  return select;
}

export function createCalcChannelAxesSelector(calc_channel_index: number, val: number) {
  const select = document.createElement("select") as HTMLSelectElement;
//   select.name = `calc_channel_axes_selector_${calc_channel_index}`;
  select.classList.add("calc_channel_axis_dropdown");
  [...Array(globalThis.numberOfAxes + 1).keys()].slice(1).forEach((num) => {
    const option = document.createElement("option") as HTMLOptionElement;
    option.value = num.toString();
    option.innerHTML = num.toString();
    select.appendChild(option);
  });
  select.value = val.toString();
  return select;
}

export function createCalcChannelVarSelector(calc_channel_index: number, val: string | undefined) {
  const select = document.createElement("select") as HTMLSelectElement;
//   select.name = `calc_channel_var_selector_${calc_channel_index}`;
  // select.id = `select_${calc_channel_index}_${calc_channel_input_index}`;
  select.classList.add("calc_channel_var_name_dropdown");
  alphabet.slice(1, -1).forEach((letter) => {
    const option = document.createElement("option") as HTMLOptionElement;
    option.value = letter.toString();
    option.innerHTML = letter.toString();
    select.appendChild(option);
  });
  if (val != undefined) {
    select.value = val;
  }
  return select;
}

export function createCalcChannelUnitsSelector(calc_channel_index: number, val: string | undefined) {
  const select = document.createElement("select") as HTMLSelectElement;
//   select.name = `calc_channel_var_selector_${calc_channel_index}`;
  // select.id = `select_${calc_channel_index}_${calc_channel_input_index}`;
  select.classList.add("calc_channel_units_dropdown");
  unitsList.forEach((unit) => {
    const option = document.createElement("option") as HTMLOptionElement;
    option.value = unit.toString();
    option.innerHTML = unit.toString();
    select.appendChild(option);
  });
  if (val != undefined) {
    select.value = val;
  }
  return select;
}
