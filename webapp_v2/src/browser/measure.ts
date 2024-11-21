import { Accessor, Setter } from "solid-js";
import { MeasureData } from "../types";

export function clearDatums(currentMeasurement: Accessor<MeasureData>, setMeasuring: Setter<MeasureData>): void {
  const newMeasure: MeasureData = {
    x1: undefined,
    x2: undefined,
    y1: [],
    y2: [],
    toolColor: currentMeasurement().toolColor,
  };
  setMeasuring(newMeasure);
  globalThis.uplot.redraw();
}

export function setPoint1(
  datasets: string[],
  currentMeasurement: Accessor<MeasureData>,
  setMeasurement: Setter<MeasureData>,
  datasetsLegendSide: number[]
) {
  const { left, top } = globalThis.uplot.cursor;
  if (left && top && left >= 0 && top >= 0) {
    let y: number[] = [];
    if (datasetsLegendSide.length == datasets.length && datasetsLegendSide.length > 0) {
      let axes_names = Array(datasetsLegendSide.length);
      for (var i = 0; i < datasetsLegendSide.length; ++i) {
        axes_names[i] = `${datasets[i].split("__")[1]}_${datasetsLegendSide[i]}`;
      }
      axes_names.forEach((axis_name) => {
        y.push(globalThis.uplot.posToVal(top, axis_name));
      });
      const newMeasurement: MeasureData = {
        x1: globalThis.uplot.posToVal(left, "x"),
        y1: y,
        x2: currentMeasurement().x2,
        y2: currentMeasurement().y2,
        toolColor: currentMeasurement().toolColor,
      };
      setMeasurement(newMeasurement);
      globalThis.uplot.redraw();
    }
  }
}

export function setPoint2(
  datasets: string[],
  currentMeasurement: Accessor<MeasureData>,
  setMeasurement: Setter<MeasureData>,
  datasetsLegendSide: number[]
) {
  const { left, top } = globalThis.uplot.cursor;
  if (left && top && left >= 0 && top >= 0) {
    let y: number[] = [];
    if (datasetsLegendSide.length == datasets.length && datasetsLegendSide.length > 0) {
      let axes_names = Array(datasetsLegendSide.length);
      for (var i = 0; i < datasetsLegendSide.length; ++i) {
        axes_names[i] = `${datasets[i].split("__")[1]}_${datasetsLegendSide[i]}`;
      }
      axes_names.forEach((axis_name) => {
        y.push(uplot.posToVal(top, axis_name));
      });
      const newMeasurement2: MeasureData = {
        x1: currentMeasurement().x1,
        y1: currentMeasurement().y1,
        x2: globalThis.uplot.posToVal(left, "x"),
        y2: y,
        toolColor: currentMeasurement().toolColor,
      };
      setMeasurement(newMeasurement2);
      globalThis.uplot.redraw();
    }
  }
}

export function formatTimeDelta(delta_ms: number): string {
  var minutes = Math.floor(delta_ms / 60000);
  var seconds = parseFloat(((delta_ms % 60000) / 1000).toFixed(3));
  if (minutes == 0) {
    return (seconds < 10 ? "0" : "") + seconds + "s";
  }
  return minutes + "m" + (seconds < 10 ? "0" : "") + seconds + "s";
}
