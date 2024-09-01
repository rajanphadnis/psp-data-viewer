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
      const t0 = performance.now();
      const scale = calcSourceName.split("__")[1];
      const sourceChannelData = calculated_toPlot[1];
      let newChannelData = [];
      for (let j = 0; j < sourceChannelData.length; j++) {
        const variable = sourceChannelData[j];
        const prevVar = sourceChannelData[j - globalThis.calcChannelWindow];
        const nextVar = sourceChannelData[j + globalThis.calcChannelWindow];
        // @ts-ignore: Unreachable code error
        let fn = evaluatex(calcChannelData.formula, {
          avg: (p1: number, p2: number) => {
            return (p1 + p2) / 2;
          },
        });
        let result = fn({
          x: variable,
          y: prevVar ?? variable,
          z: nextVar ?? variable,
        });
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
      const t1 = performance.now();
      console.log(t1 - t0);
    }
  }

  return [master_calculated_toPlot, master_calculated_series, master_calculated_axes];
}
