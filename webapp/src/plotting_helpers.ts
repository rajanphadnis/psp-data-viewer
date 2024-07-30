import uPlot, { type AlignedData } from "uplot";
import { update } from "./plotting";
import { DateTime } from "luxon";

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
  )[]
) {
  let opts = {
    ...getSize(),
    series: series,
    axes: [
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
      {
        scale: "psi",
        values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "psi"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20",
        },
        ticks: {
          show: true,
          stroke: "#80808080",
        },
      },
      {
        scale: "deg",
        values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "F"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20",
        },
        ticks: {
          show: true,
          stroke: "#80808080",
        },
      },
      {
        scale: "lbf",
        values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "lbf"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20",
        },
        ticks: {
          show: true,
          stroke: "#80808080",
        },
      },
      {
        scale: "bin",
        values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1)),
        stroke: "#fff",
        // grid: {
        //   stroke: "#ffffff20",
        // },
        side: 1,
        ticks: {
          show: false,
          stroke: "#80808080",
        },
      },
      {
        scale: "V",
        values: (u: any, vals: any[], space: any) => vals.map((v) => +v.toFixed(1) + "V"),
        stroke: "#fff",
        grid: {
          stroke: "#ffffff20",
        },
        ticks: {
          show: true,
          stroke: "#80808080",
        },
      },
    ],
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
            const min_converted = DateTime.fromMillis(min).setZone("utc", { keepLocalTime: true }).toMillis();
            const max_converted = DateTime.fromMillis(max).setZone("utc", { keepLocalTime: true }).toMillis();

            update(min_converted, max_converted)

            // zoom to selection
            uplot.setScale("x", { min, max });

            // reset selection
            uplot.setSelect({ left: 0, top: 0, width: 0, height: 0 }, false);
          }
        },
      ],
    },
    scales: {
      "x": {
        time: true,
      }
    },
  };
  document.getElementById("plot")!.innerHTML = "";
  globalThis.uplot = new uPlot(opts, toPlot, document.getElementById("plot")!);
  window.addEventListener("resize", (e) => {
    globalThis.uplot.setSize(getSize());
  });
  // console.log(uplot.hooks);
}

function getSize() {
  return {
    width: document.getElementById("plot")!.offsetWidth - 10,
    height: window.innerHeight - 90,
  };
}
