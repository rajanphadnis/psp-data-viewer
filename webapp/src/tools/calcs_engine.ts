import { generateAxisAndSeries } from "../plotting/axes_series_generation";
import { alphabet } from "../random";
import type { DatasetSeries } from "../types";

export function runCalcsEngine(
  toPlot: number[][],
  series: ({} | DatasetSeries)[],
): [number[][], ({} | DatasetSeries)[]] {
  let master_calculated_toPlot = toPlot;
  let master_calculated_series = series;
  for (let i = 0; i < globalThis.calcChannels.length; i++) {
    let calculated_toPlot = master_calculated_toPlot;
    let calculated_series = master_calculated_series;
    const calcChannelData = globalThis.calcChannels[i];
    const allChannelsPresent = calcChannelData.var_mapping
      .map((variable) => variable.source_channel)
      .every((item) => globalThis.activeDatasets_to_add.includes(item));
    if (allChannelsPresent) {
      const t0 = performance.now();
      const units = calcChannelData.units;

      let newChannelData = [];
      for (let j = 0; j < master_calculated_toPlot[0].length; j++) {
        // @ts-ignore: Unreachable code error
        let fn = evaluatex(calcChannelData.formula, {
          avg: (p1: number, p2: number) => {
            return (p1 + p2) / 2;
          },
        });
        let varmapping: any = {};
        calcChannelData.var_mapping.forEach((element) => {
          const indexOfChannel = globalThis.activeDatasets_to_add.indexOf(element.source_channel);
          const sourceChannelData = master_calculated_toPlot[indexOfChannel + 1];
          const mainLetterIndex = alphabet.indexOf(element.var_name);
          const mainLetter = element.var_name;
          const nextLetter = alphabet[mainLetterIndex + 1];
          const prevLetter = alphabet[mainLetterIndex - 1];
          const variable = sourceChannelData[j];
          const prevVar = sourceChannelData[j - globalThis.calcChannelWindow] ?? variable;
          const nextVar = sourceChannelData[j + globalThis.calcChannelWindow] ?? variable;
          varmapping[mainLetter] = variable;
          varmapping[prevLetter] = prevVar;
          varmapping[nextLetter] = nextVar;
        });
        try {
          let result = fn(varmapping);
          newChannelData.push(result);
        } catch (error) {
          alert(error);
          break;
        }
      }
      const seriesToReturn = generateAxisAndSeries(
        units,
        calcChannelData.newChannelName,
        calcChannelData.newChannelName,
        calculated_series.length,
      );
      master_calculated_toPlot = [...calculated_toPlot, newChannelData];
      master_calculated_series = [...calculated_series, seriesToReturn];
      const t1 = performance.now();
      console.log(t1 - t0);
    }
  }

  return [master_calculated_toPlot, master_calculated_series];
}
