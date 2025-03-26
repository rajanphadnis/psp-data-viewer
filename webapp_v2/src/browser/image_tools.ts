import { saveAs } from "file-saver";
import { exportSVGOfPlot } from "./plot_svg_export";

export async function plotSnapshot(type: string) {
  let [svgXml, can, ctx] = exportSVGOfPlot();
  let img = new Image();
  img.crossOrigin = "Anonymous";
  let svgBase64 = "data:image/svg+xml;base64," + btoa(svgXml);

  img.addEventListener("load", () => {
    ctx.drawImage(img, 0, 0);
    let pngBlob1: Blob;
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
      1,
    );
  });
  img.src = svgBase64;
}

export function plotSvgSnapshot() {
  let [svgXml, can, ctx] = exportSVGOfPlot();

  //add name spaces.
  // if (!svgXml.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
  //   svgXml = svgXml.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  // }
  // if (!svgXml.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
  //   svgXml = svgXml.replace(
  //     /^<svg/,
  //     '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
  //   );
  // }

  //add xml declaration
  svgXml = '<?xml version="1.0" standalone="no"?>\r\n' + svgXml;
  console.log(can);

  //convert svg source to URI data scheme.
  var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgXml);

  //set url value to a element's href attribute.
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = "plot";
  link.click();
  // document.getElementById("link").href = url;
  //you can download svg file by right click menu.
}
