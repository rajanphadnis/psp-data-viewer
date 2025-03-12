import uPlot, { Series, type AlignedData, type Options } from "uplot";
import { DateTime } from "luxon";
import { Annotation, DatasetAxis, MeasureData, PlotRange, TestBasics } from "../types";
import { Accessor, Setter } from "solid-js";
import { clearDatums, setPoint1, setPoint2 } from "../browser/measure";
import { get_annotation_name } from "./generate_annotations";

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
  annotations: Accessor<Annotation[]>,
  setAnnotations: Setter<Annotation[]>
) {
  const axes = generateAllAxes(axes_sets);
  let seriestt: (HTMLDivElement | undefined)[];
  let opts: Options = {
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
          uplot.over.onclick = (e) => {
            if (e.ctrlKey) {
              if (measuring().x1) {
                // if (measuring().x2) {
                //   if ()
                // } else {
                setPoint2(activeDatasets(), measuring, setMeasuring, datasetsLegendSide);
                // }
              } else {
                setPoint1(activeDatasets(), measuring, setMeasuring, datasetsLegendSide);
              }
            }
            if (e.altKey) {
            }
            if (e.shiftKey) {
            }
          };
          seriestt = opts.series.map((s, i) => {
            if (s.scale != "annotation") return;
            let tt = document.createElement("div");
            tt.className = "plotTooltip";
            tt.textContent = "";
            tt.style.pointerEvents = "none";
            uplot.over.appendChild(tt);
            return tt;
          });
          function hideTips() {
            seriestt.forEach((tt, i) => {
              if (tt == undefined) return;
              tt.style.display = "none";
            });
          }
          uplot.over.addEventListener("mouseleave", () => {
            if (!u.cursor.lock) {
              hideTips();
            }
          });
          if (uplot.cursor.left! < 0) {
            hideTips();
          }
        },
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
      setCursor: [
        (u: uPlot) => {
          const { left, top, idx } = u.cursor;

          // can optimize further by not applying styles if idx did not change
          seriestt.forEach((tt, i) => {
            if (tt == undefined) return;
            let s = u.series[i];
            if (s.show) {
              let xVal = u.data[0][idx!];
              let yVal = u.data[i][idx!];
              if (yVal! > 0.5) {
                tt.textContent = get_annotation_name(xVal, annotations());
                tt.style.left = Math.round(u.valToPos(xVal, "x")) + 10 + "px";
                tt.style.top = "0px";
                (tt.style.display as any) = null;
              } else {
                (tt.style.display as any) = "none";
              }
            }
          });
        },
      ],
    },
    scales: {
      x: {
        time: true,
      },
      annotation: {
        auto: false,
        range: [0.1, 0.9],
        time: false,
      },
    },
    legend: {
      show: true,
      markers: {
        show: false,
      },
      isolate: false,
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
