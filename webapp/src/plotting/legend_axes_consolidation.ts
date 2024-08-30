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
  
  const axes_scales = axes.slice(1).map((axis) => axis.scale);
  let modified_axes = axes as (undefined | DatasetAxis)[];
  let modified_series = series as (undefined | {} | DatasetSeries)[];
  
  let alreadyHasBinary = false;
  
  for (let i = 0; i < axes_scales.length; i++) {
    const axis_scale = axes_scales[i];
    if (axis_scale === "bin") {
      if (alreadyHasBinary) {
        modified_axes[i + 1] = undefined;
      } else {
        modified_axes[i + 1]!.scale = "bin";
        alreadyHasBinary = true;
      }
    }
  }
  modified_axes.filter(function (element) {
    return element !== undefined;
  });
  globalThis.plotDisplayedAxes = (modified_axes as DatasetAxis[]).map((axis) => axis.scale).slice(1);

  return [modified_series as ({} | DatasetSeries)[], modified_axes as DatasetAxis[]];
}
