import type { Firestore } from "firebase/firestore";
import { join, type AlignedData } from "uplot";
import { getSensorData } from "./db_interaction";
import { legendRound, plot } from "./plotting_helpers";
import { datasetPlottingColors, pspColors } from "./theming";

export async function plotDatasets(db: Firestore, test_name: string, datasets: string[], old_datasets: string[]) {
  let series: (
    | {}
    | {
        label: string;
        value: (self: any, rawValue: number) => string;
        stroke: string;
        width: number;
        scale: string;
        spanGaps: boolean;
      }
  )[] = [{}];
  let toPlot: any = [];
  for (let i = 0; i < datasets.length; i++) {
    const dataset: string = datasets[i];
    const fromCache: boolean = old_datasets.includes(dataset);
    const [time, data, scale] = await getSensorData(db, test_name, dataset, fromCache);
    toPlot[0] = time;
    toPlot.push(data);
    series.push({
        label: dataset,
      value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
      stroke: datasetPlottingColors[i],
      width: 2,
      scale: scale,
      spanGaps: true,
    });
  }
  console.log("done");
  plot(toPlot, series);
}
