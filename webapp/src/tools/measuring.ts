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
  let stringToWrite = `Δt=${((globalThis.x2 - globalThis.x1) * 1000).toFixed(2)}ms`;
  for (let i = 0; i < globalThis.plotDisplayedAxes.length; i++) {
    const displayedAxis: string = globalThis.plotDisplayedAxes[i];
    const nameOnly = displayedAxis.split("__")[0];
    const val = (globalThis.y2[i] - globalThis.y1[i]).toFixed(4);
    stringToWrite = stringToWrite + `</br>Δ${nameOnly}=${val}${displayedAxis.split("__")[1]}`;
  }
  deltaDiv.innerHTML = stringToWrite;
  console.log(globalThis.x1, globalThis.x2, globalThis.y1, globalThis.y2);
}
export function clearDatums(u: uPlot): void {
  globalThis.x1 = globalThis.x2 = null;
  globalThis.y1 = globalThis.y2 = [];
  const deltaDiv = document.getElementById("measurementPopup")! as HTMLDivElement;
  deltaDiv.innerHTML =
    '<a href="https://psp-docs.rajanphadnis.com/docs/webapp/tools/meauring_tool" target="_blank">Documentation</a>';
  u.redraw();
}
