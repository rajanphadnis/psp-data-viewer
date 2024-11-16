import uPlot, { type AlignedData, type Options } from "uplot";
import { DateTime } from "luxon";
import { DatasetAxis, MeasureData, PlotRange, TestBasics } from "../types";
import { Accessor, Setter } from "solid-js";
import { clearDatums, setPoint1, setPoint2 } from "../browser/measure";

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
  setPlotRange: Setter<PlotRange>,
  testBasics: Accessor<TestBasics>,
  activeDatasets: Accessor<string[]>,
  measuring: Accessor<MeasureData>,
  displayedAxes: string[],
  setMeasuring: Setter<MeasureData>,
  datasetsLegendSide: number[]
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
          if (measuring().x1 != undefined || measuring().x2 != undefined) {
            uplot.ctx.save();
            uplot.ctx.lineWidth = 2;
            if (measuring().x1 != undefined) {
              let cx = uplot.valToPos(measuring().x1!, "x", true);
              let cy = uplot.valToPos(measuring().y1[0], displayedAxes[0], true);
              let rad = 10;

              uplot.ctx.strokeStyle = measuring().toolColor;
              uplot.ctx.beginPath();

              uplot.ctx.arc(cx, cy, rad, 0, 2 * Math.PI);

              uplot.ctx.moveTo(cx - rad - 5, cy);
              uplot.ctx.lineTo(cx + rad + 5, cy);
              uplot.ctx.moveTo(cx, cy - rad - 5);
              uplot.ctx.lineTo(cx, cy + rad + 5);

              uplot.ctx.stroke();
            }
            if (measuring().x2 != undefined) {
              let cx = uplot.valToPos(measuring().x2!, "x", true);
              let cy = uplot.valToPos(measuring().y2[0], displayedAxes[0], true);
              let rad = 10;

              uplot.ctx.strokeStyle = measuring().toolColor;
              uplot.ctx.beginPath();

              uplot.ctx.arc(cx, cy, rad, 0, 2 * Math.PI);

              uplot.ctx.moveTo(cx - rad - 5, cy);
              uplot.ctx.lineTo(cx + rad + 5, cy);
              uplot.ctx.moveTo(cx, cy - rad - 5);
              uplot.ctx.lineTo(cx, cy + rad + 5);

              uplot.ctx.stroke();
              // updateDeltaText();
            }
            uplot.ctx.restore();
          }
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
  });

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
