import { saveAs } from "file-saver";

export async function plotSnapshot(type: string) {
  let pxRatio = devicePixelRatio;

  let rect = globalThis.uplot.root.getBoundingClientRect();
  // rect of uPlot's canvas to get y shift due to title above it (if any)
  let rect2 = globalThis.uplot.ctx.canvas.getBoundingClientRect();

  let htmlContent = globalThis.uplot.root.outerHTML;

  let uPlotCssRules: any = document.styleSheets[2].cssRules;
  let uPlotCssOverrideRules: any = document.styleSheets[3].cssRules;
  let cssContent = "";
  for (let { cssText } of uPlotCssRules) cssContent += `${cssText} `;
  for (let { cssText } of uPlotCssOverrideRules) cssContent += `${cssText} `;

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
  let ctx = can.getContext("2d")!;
  can.width = width;
  can.height = height;
  can.style.width = Math.ceil(rect.width) + "px";
  can.style.height = Math.ceil(rect.height) + "px";
    // document.body.appendChild(can);

  let img = new Image();
  img.crossOrigin = "Anonymous";

  ctx.drawImage(globalThis.uplot.ctx.canvas, 0, (rect2.top - rect.top) * pxRatio);

  let SVGContainer = document.createElement("div");
  SVGContainer.style.display = "none";
  SVGContainer.innerHTML = svgText;
  let svgNode: any = SVGContainer.firstElementChild;
  let svgXml = new XMLSerializer().serializeToString(svgNode);
  let svgBase64 = "data:image/svg+xml;base64," + btoa(svgXml);

  img.addEventListener("load", () => {
    ctx.drawImage(img, 0, 0);let pngBlob1: Blob;
  can.toBlob(
    function (blob) {
      pngBlob1 = blob!;
      if (type == "download") {
        saveAs(pngBlob1, "plotSnapshot.png");
      } else {
        const item = new ClipboardItem({ "image/png": pngBlob1 });
        navigator.clipboard.write([item]);
      }
    },
    "image/png",
    1
  );
  });
  img.src = svgBase64; 
}
