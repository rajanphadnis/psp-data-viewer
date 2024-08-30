import uPlot, { type AlignedData, type Options } from "uplot";
import { update } from "./main";
import { DateTime } from "luxon";
import { defaultMeasuringToolColors, defaultPlottingColors } from "../theming";
import type { DatasetAxis } from "../types";
import Coloris from "@melloware/coloris";
import { clearDatums, drawDatum, updateDeltaText } from "../tools/measuring";
import { addKeyPressListeners } from "./init";

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
            update();
          };
        },
        (uplot: uPlot) => {
          addKeyPressListeners();
        },
      ],

      draw: [
        (uplot: uPlot) => {
          if (globalThis.x1 != null || globalThis.x2 != null) {
            uplot.ctx.save();

            uplot.ctx.lineWidth = 2;

            if (globalThis.x1 != null) {
              drawDatum(uplot, globalThis.x1, globalThis.y1[0], globalThis.measuringToolColor);
            }

            if (globalThis.x2 != null) {
              drawDatum(uplot, globalThis.x2, globalThis.y2[0], globalThis.measuringToolColor);
              updateDeltaText();
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
  uplot = new uPlot(opts as unknown as Options, toPlot, document.getElementById("plot")!);
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
