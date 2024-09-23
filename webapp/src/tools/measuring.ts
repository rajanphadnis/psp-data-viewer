import { open_in_new_tab_icon } from "../html_components";

export function drawDatum(u: uPlot, x: number, y: number, color: string) {
  let cx = u.valToPos(x, "x", true);
  let cy = u.valToPos(y, globalThis.plotDisplayedAxes[0], true);
  let rad = 10;

  u.ctx.strokeStyle = color;
  u.ctx.beginPath();

  u.ctx.arc(cx, cy, rad, 0, 2 * Math.PI);

  u.ctx.moveTo(cx - rad - 5, cy);
  u.ctx.lineTo(cx + rad + 5, cy);
  u.ctx.moveTo(cx, cy - rad - 5);
  u.ctx.lineTo(cx, cy + rad + 5);

  u.ctx.stroke();
}
export function updateDeltaText() {
  const deltaDiv = document.getElementById("measurementPopup")! as HTMLDivElement;
  let stringToWrite = `Δt=${formatTimeDelta((globalThis.x2! - globalThis.x1!) * 1000)}`;
  let calcChannelCounter = 0;
  for (let i = 0; i < globalThis.plotDisplayedAxes.length; i++) {
    const displayedAxis: string = globalThis.plotDisplayedAxes[i];
    const scaleName = displayedAxis.split("_")[0];
    console.log(globalThis.calcChannels);
    let name = "";
    if (!globalThis.activeDatasets_to_add[i]) {
      name = globalThis.calcChannels[calcChannelCounter].newChannelName;
      calcChannelCounter = calcChannelCounter + 1;
    } else {
      name = globalThis.activeDatasets_to_add[i].split("__")[0];
    }
    const val = (globalThis.y2[i] - globalThis.y1[i]).toFixed(4);
    if (scaleName != "bin") {
      stringToWrite = stringToWrite + `</br>Δ${name}=${val}${displayedAxis.split("_")[0]}`;
    }
  }

  deltaDiv.innerHTML = stringToWrite;
}
export function clearDatums(u: uPlot): void {
  globalThis.x1 = globalThis.x2 = null;
  globalThis.y1 = globalThis.y2 = [];
  const deltaDiv = document.getElementById("measurementPopup")! as HTMLDivElement;
  deltaDiv.innerHTML = `<a href="https://psp-docs.rajanphadnis.com/docs/webapp/tools/measuring_tool" target="_blank">Documentation${open_in_new_tab_icon}</a>`;
  u.redraw();
}

export function setPoint1() {
  const { left, top } = globalThis.uplot.cursor;
  if (left && top && left >= 0 && top >= 0) {
    globalThis.x1 = globalThis.uplot.posToVal(left, "x");
    globalThis.y1 = [];
    globalThis.plotDisplayedAxes.forEach((scale) => {
      globalThis.y1.push(globalThis.uplot.posToVal(top, scale));
    });
    globalThis.uplot.redraw();
  }
}

export function setPoint2() {
  const { left, top } = globalThis.uplot.cursor;
  if (left && top && left >= 0 && top >= 0) {
    globalThis.x2 = globalThis.uplot.posToVal(left, "x");
    globalThis.y2 = [];
    globalThis.plotDisplayedAxes.forEach((scale) => {
      globalThis.y2.push(globalThis.uplot.posToVal(top, scale));
    });
    globalThis.uplot.redraw();
  }
}

function formatTimeDelta(delta_ms: number): string {
  var minutes = Math.floor(delta_ms / 60000);
  var seconds = parseFloat(((delta_ms % 60000) / 1000).toFixed(3));
  if (minutes == 0) {
    return (seconds < 10 ? "0" : "") + seconds + "s";
  }
  return minutes + "m" + (seconds < 10 ? "0" : "") + seconds + "s";
}
