import { DateTime } from "luxon";
import { Accessor, Setter } from "solid-js";
import uPlot, { Series, type Options } from "uplot";
import { clearDatums, setPoint1, setPoint2 } from "../browser/measure";
import {
  Annotation,
  DatasetAxis,
  MeasureData,
  PlotRange,
  TestBasics,
} from "../types";
import {
  create_annotation,
  delete_annotation,
  get_annotation_label,
} from "./generate_annotations";
import { getSize } from "./plotting_helpers";

export function generatePlottingOptions(
  axes: DatasetAxis[],
  series: ({} | Series)[],
  setPlotRange: Setter<PlotRange>,
  testBasics: Accessor<TestBasics>,
  activeDatasets: Accessor<string[]>,
  measuring: Accessor<MeasureData>,
  displayedAxes: string[],
  setMeasuring: Setter<MeasureData>,
  datasetsLegendSide: number[],
  annotations: Annotation[],
  annotation_ref: HTMLButtonElement,
  setCurrentAnnotation: Setter<Annotation | undefined>,
  annotation_height: number,
  annotationsEnabled: boolean,
): Options {
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
            setPlotRange({
              start: testBasics().starting_timestamp!,
              end: testBasics().ending_timestamp!,
            });
          };
          uplot.over.onclick = async (e) => {
            if (e.ctrlKey) {
              if (measuring().x1) {
                if (measuring().x2) {
                  clearDatums(measuring, setMeasuring);
                } else {
                  setPoint2(
                    activeDatasets(),
                    measuring,
                    setMeasuring,
                    datasetsLegendSide,
                  );
                }
              } else {
                setPoint1(
                  activeDatasets(),
                  measuring,
                  setMeasuring,
                  datasetsLegendSide,
                );
              }
            }
            if (e.shiftKey) {
              if (annotationsEnabled) {
                create_annotation(uplot, annotation_ref, setCurrentAnnotation);
              }
            }
          };
          uplot.over.oncontextmenu = async (e) => {
            e.preventDefault();
            if (e.shiftKey) {
              if (annotationsEnabled) {
                delete_annotation(
                  uplot,
                  annotations,
                  annotation_ref,
                  setCurrentAnnotation,
                );
              }
            } else {
              if (annotationsEnabled) {
                create_annotation(uplot, annotation_ref, setCurrentAnnotation);
              }
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
            if (!uplot.cursor.lock) {
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
              let cy = uplot.valToPos(
                measuring().y1[0],
                displayedAxes[0],
                true,
              );
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
              let cy = uplot.valToPos(
                measuring().y2[0],
                displayedAxes[0],
                true,
              );
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
            let min = parseInt(
              (uplot.posToVal(uplot.select.left, "x") * 1000).toString(),
            );
            let max = parseInt(
              (
                uplot.posToVal(uplot.select.left + uplot.select.width, "x") *
                1000
              ).toString(),
            );

            console.log("Fetching data for range...", { min, max });
            const min_converted = DateTime.fromMillis(min)
              .setZone("utc", { keepLocalTime: false })
              .toMillis();
            const max_converted = DateTime.fromMillis(max)
              .setZone("utc", { keepLocalTime: false })
              .toMillis();

            console.log("update goes here");
            setPlotRange({
              start: Math.round(Number(min_converted)),
              end: Math.round(Number(max_converted)),
            });

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
                tt.innerHTML = get_annotation_label(xVal, annotations);
                tt.style.left = Math.round(u.valToPos(xVal, "x")) + 10 + "px";
                tt.style.top = `${annotation_height * -10}px`;
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
  return opts;
}
