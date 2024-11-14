import uPlot, { type AlignedData, type Options } from "uplot";
// import { update } from "./main";
import { DateTime } from "luxon";
import { DatasetAxis, PlotRange, TestBasics } from "../types";
import { Accessor, Setter } from "solid-js";
// import { update } from "./update";

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
  axes_sets: number,
  // start_time: number,
  // end_time: number,
  setPlotRange: Setter<PlotRange>,
  testBasics: Accessor<TestBasics>,
  activeDatasets: Accessor<string[]>
) {
  const axes = generateAllAxes(axes_sets);
  let opts = {
    ...getSize(),
    series: series,
    axes: axes,
    padding: [null, 8, null, 6],
    hooks: {
      init: [
        (uplot: uPlot) => {
          uplot.over.ondblclick = (e) => {
            console.log("Fetching data for full range");
            setPlotRange({ start: testBasics().starting_timestamp!, end: testBasics().ending_timestamp! });
          };
        },
        // (uplot: uPlot) => {
        //   addKeyPressListeners();
        // },
      ],

      draw: [
        (uplot: uPlot) => {
          // if (globalThis.measuringTool_x1 != null || globalThis.measuringTool_x2 != null) {
          //   uplot.ctx.save();
          //   uplot.ctx.lineWidth = 2;
          // if (globalThis.measuringTool_x1 != null) {
          //   drawDatum(uplot, globalThis.measuringTool_x1, globalThis.measuringTool_y1[0], globalThis.measuringToolColor);
          // }
          // if (globalThis.measuringTool_x2 != null) {
          //   drawDatum(uplot, globalThis.measuringTool_x2, globalThis.measuringTool_y2[0], globalThis.measuringToolColor);
          //   updateDeltaText();
          // }
          //   uplot.ctx.restore();
          // }
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

            console.log("update goes here");
            setPlotRange({ start: Math.round(Number(min_converted)), end: Math.round(Number(max_converted)) });

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
  const plotDiv = document.getElementById("plot")! as HTMLDivElement;
  // plotDiv.innerHTML = "";
  const plotDivs = document.getElementsByClassName("uplot");
  if (plotDivs.length > 0) {
    plotDivs[0].remove();
  }
  // if (activeDatasets().length == 0) {
  // } 
  // else {
    globalThis.uplot = new uPlot(opts as unknown as Options, toPlot, plotDiv);
    window.addEventListener("resize", (e) => {
      globalThis.uplot.setSize(getSize());
    });
  // }
  // const overlayDiv = document.getElementById("plotOverlayDiv")! as HTMLDivElement;
  // if (toPlot.length == 0) {
  //   overlayDiv.style.display = "flex";
  // } else {
  //   overlayDiv.style.display = "none";
  // }
}

function getSize() {
  return {
    width: document.getElementById("plot")!.offsetWidth - 10,
    height: window.innerHeight - 90,
  };
}

function generateAllAxes(totalAxes: number) {
  let axesToReturn: DatasetAxis[] = [];
  for (let i = 1; i < totalAxes + 1; i++) {
    axesToReturn = [...axesToReturn, ...generateAxes(i)];
  }
  return [
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
  ];
}

function generateAxes(axesSide: number): DatasetAxis[] {
  let axesToReturn: DatasetAxis[] = [];
  const isOdd = axesSide % 2 == 1;
  axesToReturn.push(
    {
      scale: `lbf_${axesSide}`,
      values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "lbf"),
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
      values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "psi"),
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
      values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "V"),
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
      values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + ""),
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
      values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "deg"),
      stroke: "#fff",
      grid: {
        stroke: "#ffffff20",
      },
      side: isOdd ? 3 : 1,
      ticks: {
        show: true,
        stroke: "#80808080",
      },
    }
  );
  return axesToReturn;
}