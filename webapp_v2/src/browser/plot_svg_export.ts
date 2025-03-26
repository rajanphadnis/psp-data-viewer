// const C2S = require('canvas2svg');

export function exportSVGOfPlot(): [
  string,
  HTMLCanvasElement,
  CanvasRenderingContext2D,
] {
  let pxRatio = devicePixelRatio;
  let rect = globalThis.uplot.root.getBoundingClientRect();
  // rect of uPlot's canvas to get y shift due to title above it (if any)
  let rect2 = globalThis.uplot.ctx.canvas.getBoundingClientRect();
  let htmlContent = globalThis.uplot.root.outerHTML;
  let cssContent = "";

  let width = Math.ceil(rect.width * pxRatio);
  let height = Math.ceil(rect.height * pxRatio);

  let viewBox = `0 0 ${Math.ceil(rect.width)} ${Math.ceil(rect.height)}`;

  let svgText = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
            <style>
                body { margin: 0; padding: 0; }
                ${cssContent}
            </style>
            <foreignObject width="100%" height="100%">
                <body xmlns="http://www.w3.org/1999/xhtml">${htmlContent}</body>
            </foreignObject>
        </svg>
    `;

  let can = document.createElement("canvas");
  // var ctx = new C2S(500,500);
  let ctx = can.getContext("2d")!;
  can.width = width;
  can.height = height;
  can.style.width = Math.ceil(rect.width) + "px";
  can.style.height = Math.ceil(rect.height) + "px";
  ctx.drawImage(uplot.ctx.canvas, 0, (rect2.top - rect.top) * pxRatio);

  let SVGContainer = document.createElement("div");
  SVGContainer.style.display = "none";
  SVGContainer.innerHTML = svgText;
  let svgNode: any = SVGContainer.firstElementChild;
  let svgXml = new XMLSerializer().serializeToString(svgNode);
  return [svgXml, can, ctx];
}
