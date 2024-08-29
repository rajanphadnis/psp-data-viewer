import uPlot, { type AlignedData, type Options } from "uplot";
import { update } from "./plotting";
import { DateTime } from "luxon";
import { getDatasetPlottingColor } from "./theming";
import type { DatasetAxis, DatasetSeries } from "./types";

export function legendRound(val: any, suffix: string, precision: number = 2) {
  if (val == null || val == undefined || val == "null") {
    return "";
  }
  if (suffix == " bin") {
    return val > 0.5 ? "Open" : "Closed";
  } else {
    return val.toFixed(precision) + suffix;
  }
}

export function plot(
  toPlot: AlignedData,
  series: (
    | {}
    | {
        label: string;
        value: (self: any, rawValue: number) => string;
        stroke: string;
        width: number;
        scale: string;
        spanGaps: boolean;
      }
  )[],
  axes: DatasetAxis[]
) {
  let opts = {
    ...getSize(),
    series: series,
    axes: axes,
    hooks: {
      init: [
        (uplot: uPlot) => {
          uplot.over.ondblclick = (e) => {
            console.log("Fetching data for full range");

            // uplot.setData(data);
            update();
          };
        },
      ],
      setSelect: [
        (uplot: uPlot) => {
          if (uplot.select.width > 0) {
            let min = parseInt((uplot.posToVal(uplot.select.left, "x") * 1000).toString());
            let max = parseInt((uplot.posToVal(uplot.select.left + uplot.select.width, "x") * 1000).toString());

            console.log("Fetching data for range...", { min, max });
            const min_converted = DateTime.fromMillis(min).setZone("utc", { keepLocalTime: false }).toMillis();
            const max_converted = DateTime.fromMillis(max).setZone("utc", { keepLocalTime: false }).toMillis();

            update(Math.round(Number(min_converted)), Math.round(Number(max_converted)));

            // zoom to selection
            uplot.setScale("x", { min, max });

            // reset selection
            uplot.setSelect({ left: 0, top: 0, width: 0, height: 0 }, false);
          }
        },
      ],
    },
    scales: {
      x: {
        time: true,
      },
    },
  };
  document.getElementById("plot")!.innerHTML = "";
  uplot = new uPlot(opts as Options, toPlot, document.getElementById("plot")!);
  window.addEventListener("resize", (e) => {
    uplot.setSize(getSize());
  });
}

function getSize() {
  return {
    width: document.getElementById("plot")!.offsetWidth - 10,
    height: window.innerHeight - 90,
  };
}

export function generateAxisAndSeries(scale: string, dataset: string, dataset_name: string, dataset_index: number): [DatasetSeries, DatasetAxis] {
  const scaleToUse: string = scale == "bin" ? "bin" : `${scale}_${dataset}`;
  const scaleUnitLabel: string = scale == "bin" ? "" : scale;
  const seriesToReturn: DatasetSeries = {
    label: dataset_name,
    value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
    stroke: getDatasetPlottingColor(dataset_index),
    width: 2,
    scale: scaleToUse,
    spanGaps: true,
  };
  const axisToReturn: DatasetAxis = {
    scale: scaleToUse,
    values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + scaleUnitLabel),
    stroke: "#fff",
    grid: {
      stroke: "#ffffff20",
    },
    side: 3,
    ticks: {
      show: true,
      stroke: "#80808080",
    },
  };
  return [seriesToReturn, axisToReturn];
}
