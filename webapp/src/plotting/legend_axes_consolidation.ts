import type { DatasetAxis, DatasetSeries } from "../types";

function synchronizeDatasetsAndLegendList(axes: DatasetAxis[]) {
  let axisSideList = axes.slice(1).map((s) => s.side);
  const isAddingDatasets = globalThis.activeDatasets_legend_side.length < axisSideList.length;
  const smallerListLength = isAddingDatasets ? globalThis.activeDatasets_legend_side.length : axisSideList.length;
  for (let i = 0; i < smallerListLength; i++) {
    axisSideList[i] = globalThis.activeDatasets_legend_side[i];
  }
  if (isAddingDatasets) {
    for (let j = axisSideList.length - 1; j < axisSideList.length; j++) {
      globalThis.activeDatasets_legend_side[j] = axisSideList[j];
    }
  } else {
    globalThis.activeDatasets_legend_side = axisSideList;
  }
}

export function consolidateLegends(
  series: ({} | DatasetSeries)[],
  axes: DatasetAxis[]
): [({} | DatasetSeries)[], DatasetAxis[]] {
  globalThis.plotDisplayedAxes = axes.map((axis) => axis.scale).slice(1);
  console.log(globalThis.plotDisplayedAxes);
  return [series, axes];
}
