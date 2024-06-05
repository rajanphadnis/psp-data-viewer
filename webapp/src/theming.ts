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

export function datasetPlottingColors() {
  const defaultColors = [
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
  const extendedList = extendList(defaultColors, 20);
  console.log(extendedList);
  return extendedList;
}

function extendList(baseList: string[], targetNum: number): string[] {
  let toReturn: string[] = [];
  for (let i = 0; i < targetNum; i++) {
    toReturn[i] = baseList[i % baseList.length]
  }
  return toReturn;
}
