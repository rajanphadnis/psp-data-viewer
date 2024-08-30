import type { DatasetAxis, DatasetSeries } from "../types";

export function consolidateLegends(
  series: ({} | DatasetSeries)[],
  axes: DatasetAxis[]
): [({} | DatasetSeries)[], DatasetAxis[]] {
  
  const axes_scales = axes.slice(1).map((axis) => axis.scale);
  let modified_axes = axes as (string | DatasetAxis)[];
  let modified_series = series as (undefined | {} | DatasetSeries)[];
  let axes_toReturn: DatasetAxis[] = [];
  
  let alreadyHasBinary = false;
  let alreadyHasBinaryIndex = 0;
  
  for (let i = 0; i < axes_scales.length; i++) {
    const axis_scale = axes_scales[i];
    if (axis_scale == "bin") {
      if (alreadyHasBinary) {
        modified_axes[i + 1] = "bad";
        globalThis.activeDatasets_legend_side[i] = globalThis.activeDatasets_legend_side[alreadyHasBinaryIndex];
      } else {
        (modified_axes[i + 1] as DatasetAxis).scale = "bin";
        alreadyHasBinary = true;
        alreadyHasBinaryIndex = i;
      }
    }
  }
  modified_axes.forEach(axis => {
    if (axis.toString() != "bad") {
      axes_toReturn.push(axis as DatasetAxis);
    }
  });
  globalThis.plotDisplayedAxes = axes_toReturn.map((axis) => axis.scale).slice(1);

  return [modified_series as ({} | DatasetSeries)[], axes_toReturn as DatasetAxis[]];
}
