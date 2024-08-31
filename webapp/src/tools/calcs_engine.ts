import { generateAxisAndSeries } from "../plotting/axes_series_generation";
import type { DatasetSeries, DatasetAxis } from "../types";

export function runCalcsEngine(
  toPlot: number[][],
  series: ({} | DatasetSeries)[],
  axes: DatasetAxis[]
): [number[][], ({} | DatasetSeries)[], DatasetAxis[]] {
  let master_calculated_toPlot = toPlot;
  let master_calculated_series = series;
  let master_calculated_axes = axes;
  for (let i = 0; i < globalThis.calcChannels.length; i++) {
    let calculated_toPlot = master_calculated_toPlot;
    let calculated_series = master_calculated_series;
    let calculated_axes = master_calculated_axes;
    const calcChannelData = globalThis.calcChannels[i];
    const calcSourceName = calcChannelData.sourceChannel;
    if (globalThis.activeDatasets_to_add.includes(calcSourceName)) {
      const scale = calcSourceName.split("__")[1];
      const sourceChannelData = calculated_toPlot[1];
      let newChannelData = [];
      for (let j = 0; j < sourceChannelData.length; j++) {
        const variable = sourceChannelData[j];
        // @ts-ignore: Unreachable code error
        let fn = evaluatex(calcChannelData.formula);
        let result = fn({ x: variable });
        newChannelData.push(result);
      }
      const [seriesToReturn, axisToReturn] = generateAxisAndSeries(
        scale,
        calcChannelData.newChannelName,
        calcChannelData.newChannelName,
        calculated_series.length,
        calcChannelData.axisSide
      );
      master_calculated_toPlot = [...calculated_toPlot, newChannelData];
      master_calculated_series = [...calculated_series, seriesToReturn];
      master_calculated_axes = [...calculated_axes, axisToReturn];
    }
  }

  return [master_calculated_toPlot, master_calculated_series, master_calculated_axes];
}
