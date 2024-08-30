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

export const defaultMeasuringToolColors = ["#ffa500", "#5d00ff", "#d000ff", "#ff009d", "#00ff4c"];

export const measuringToolDefaultColor = "#ffa500";
