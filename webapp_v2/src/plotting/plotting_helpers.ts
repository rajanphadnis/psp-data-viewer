import { DateTime } from "luxon";
import { Accessor, Setter } from "solid-js";
import uPlot, { Series, type AlignedData, type Options } from "uplot";
import { clearDatums, setPoint1, setPoint2 } from "../browser/measure";
import {
  Annotation,
  DatasetAxis,
  LoadingStateType,
  MeasureData,
  PlotRange,
  TestBasics,
} from "../types";
import {
  create_annotation,
  delete_annotation,
  get_annotation_label,
} from "./generate_annotations";
import { generatePlottingOptions } from "./plotting_opts";

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
  series: ({} | Series)[],
  axes_sets: number,
  setPlotRange: Setter<PlotRange>,
  testBasics: Accessor<TestBasics>,
  activeDatasets: Accessor<string[]>,
  measuring: Accessor<MeasureData>,
  displayedAxes: string[],
  setMeasuring: Setter<MeasureData>,
  datasetsLegendSide: number[],
  annotations: Annotation[],
  setAnnotations: Setter<Annotation[]>,
  setLoadingState: Setter<LoadingStateType>,
  annotation_ref: HTMLButtonElement,
  setCurrentAnnotation: Setter<Annotation | undefined>,
  annotation_height: number,
  annotationsEnabled: boolean,
) {
  const axes: (DatasetAxis | any)[] = generateAllAxes(axes_sets);
  let opts: Options = generatePlottingOptions(
    axes,
    series,
    setPlotRange,
    testBasics,
    activeDatasets,
    measuring,
    displayedAxes,
    setMeasuring,
    datasetsLegendSide,
    annotations,
    annotation_ref,
    setCurrentAnnotation,
    annotation_height,
    annotationsEnabled,
  );
  const plotDiv = document.getElementById("plot")! as HTMLDivElement;
  const plotDivs = document.getElementsByClassName("uplot");
  if (plotDivs.length > 0) {
    plotDivs[0].remove();
  }
  let u = new uPlot(opts as unknown as Options, toPlot, plotDiv);
  globalThis.uplot = u;
  window.addEventListener("resize", (e) => {
    globalThis.uplot.setSize(getSize());
  });

  window.addEventListener("keydown", (e) => {
    if (e && e.key == "1") {
      setPoint1(activeDatasets(), measuring, setMeasuring, datasetsLegendSide);
    }
    if (e && e.key == "2") {
      setPoint2(activeDatasets(), measuring, setMeasuring, datasetsLegendSide);
    }
    if (e && e.key == "Escape") {
      clearDatums(measuring, setMeasuring);
    }
    // if (e && (e.key == "Backspace" || e.key == "Delete")) {
    //   delete_annotation(u, testBasics().id, setLoadingState, annotations);
    // }
  });
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}

export function getSize() {
  return {
    width: document.getElementById("plot")!.offsetWidth - 10,
    height: window.innerHeight - 90,
  };
}

export function generateAllAxes(totalAxes: number) {
  let axesToReturn: DatasetAxis[] = [];
  for (let i = 1; i < totalAxes + 1; i++) {
    axesToReturn = [...axesToReturn, ...generateAxes(i)];
  }
  const mainAxes = [
    {
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    },
    ...axesToReturn,
    {
      show: false,
      // size: 0,
      // labelSize: 0,
      scale: `annotation`,
      // values: (u: any, vals: any[], space: any) => vals.map((v) => `${v} t`),
      // stroke: "#fff",
      grid: { show: false },
      // side: isOdd ? 3 : 1,
      ticks: { show: false },
    },
  ];
  return mainAxes;
}

export function generateAxes(axesSide: number): DatasetAxis[] {
  let axesToReturn: DatasetAxis[] = [];
  const isOdd = axesSide % 2 == 1;
  axesToReturn.push(
    {
      scale: `lbf_${axesSide}`,
      values: (u: any, vals: any[], space: any) =>
        vals.map((v) => +v.toFixed(1) + "lbf"),
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      side: isOdd ? 3 : 1,
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    },
    {
      scale: `psi_${axesSide}`,
      values: (u: any, vals: any[], space: any) =>
        vals.map((v) => +v.toFixed(1) + "psi"),
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      side: isOdd ? 3 : 1,
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    },
    {
      scale: `V_${axesSide}`,
      values: (u: any, vals: any[], space: any) =>
        vals.map((v) => +v.toFixed(1) + "V"),
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      side: isOdd ? 3 : 1,
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    },
    {
      scale: `bin_${axesSide}`,
      values: (u: any, vals: any[], space: any) =>
        vals.map((v) => +v.toFixed(1) + ""),
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      side: isOdd ? 3 : 1,
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    },
    {
      scale: `deg_${axesSide}`,
      values: (u: any, vals: any[], space: any) =>
        vals.map((v) => +v.toFixed(1) + "deg"),
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      side: isOdd ? 3 : 1,
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    },
  );
  return axesToReturn;
}
