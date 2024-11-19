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

export function getDatasetPlottingColor(colors: string[], index: number) {
  const availableLength = colors.length;
  const mod = index % availableLength;
  // globalThis.activeDatasets_to_add[index]
  return colors[mod];
}

// export function getPlottingColorListLength() {
//   return plotPalletteColors().length;
// }

// export const defaultPlottingColors = [
//   pspColors.field,
//   pspColors["bm-gold"],
//   pspColors.aged,
//   "#FF5733",
//   "#FFC300",
//   "#FFA07A",
//   "#8CE68C",
//   "red",
//   "#ABF1BC",
//   "#FF8C00",
//   "#CFFFF6",
//   "#FFD700",
//   "#AEE7F8",
//   "#87CDF6",
//   "blue",
// ];

export const defaultPlottingColors = ["#FF4500", "#00FFFF", "#FFD700", "#00FF00", "#FF1493", "#1E90FF", "#9efff9", "#ffb5b5"];

export const defaultMeasuringToolColors = ["#ffa500", "#5d00ff", "#d000ff", "#ff009d", "#00ff4c"];

export const measuringToolDefaultColor = "#ffa500";
