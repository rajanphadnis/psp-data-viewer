export const pspColors = {
  "night-sky": "#252526",
  rush: "#DAAA00",
  moondust: "#F2EFE9",
  "bm-gold": "#CFB991",
  aged: "#8E6F3E",
  field: "#DDB945",
  dust: "#EBD99F",
  steel: "#555960",
  "cool-gray": "#6F727B",
};

export function getDatasetPlottingColor(index: number) {
  const availableLength = globalThis.plotPalletteColors.length;
  const mod = index % availableLength;
  return globalThis.plotPalletteColors[mod];
}

export function getPlottingColorListLength() {
  return globalThis.plotPalletteColors.length;
}

export function getColorList() {
  const inputFields = document.querySelectorAll(".test-field-text")! as NodeListOf<HTMLInputElement>;
  let newColorList: string[] = [];
  inputFields.forEach(inputField => {
    newColorList.push(inputField.value);
  });
  return newColorList;
}

export function initColorList() {
  let storageItem = localStorage.getItem("plotting_color_pallette_color_list");
  if (storageItem == null) {
    globalThis.plotPalletteColors = defaultPlottingColors;
  } else {
    globalThis.plotPalletteColors = JSON.parse(storageItem);
  }
}

export const defaultPlottingColors = [
  pspColors.field,
  pspColors["bm-gold"],
  pspColors.aged,
  "#FF5733",
  "#FFC300",
  "#FFA07A",
  "#8CE68C",
  "red",
  "#ABF1BC",
  "#FF8C00",
  "#CFFFF6",
  "#FFD700",
  "#AEE7F8",
  "#87CDF6",
  "blue",
];
