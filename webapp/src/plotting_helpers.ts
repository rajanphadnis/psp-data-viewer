import uPlot, { type AlignedData } from "uplot";

export function legendRound(val: any, suffix: string, precision: number = 2) {
  if (val == null || val == undefined || val == "null") {
    return "";
  } if (suffix == " bin") {
    return val>0.5?"Open":"Closed"
  }
  else {
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
  };
  document.getElementById("plot")!.innerHTML = "";
  uplot = new uPlot(opts, toPlot, document.getElementById("plot")!);
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
