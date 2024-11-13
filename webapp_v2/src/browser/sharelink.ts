import { Accessor, Setter } from "solid-js";
import { PlotRange, TestBasics } from "../types";

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

export function loadFromShareLink(
  testBasics: Accessor<TestBasics>,
  setPlotRange: Setter<PlotRange>,
  setDatasetsLegendSide: Setter<number[]>,
  setActiveDatasets: Setter<string[]>
) {
  // const [activeDatasets, setActiveDatasets, { buttonClickHandler }]: any = useCounter();
  let param = getQueryVariable("b64");
  if (param == undefined || param == "") {
    console.log("no b64");
    // setActiveDatasets(new Array<string>());
    setPlotRange({
      start: testBasics().starting_timestamp!,
      end: testBasics().ending_timestamp!,
    });
    setDatasetsLegendSide(new Array<number>());
  } else {
    const decodedList = decode(param);
    const paramList = decodedList.split(":::");
    setActiveDatasets(paramList[0].split(","));
    setPlotRange({
      start: parseInt(paramList[1]),
      end: parseInt(paramList[2]),
    });
    setDatasetsLegendSide(paramList[3].split(",").map(Number));
  }
}

export function getSharelink(datasets: string[], start: number, end: number, legend_list: number[]): [string, string] {
  // const [activeDatasets, setActiveDatasets, { buttonClickHandler }]: any = useCounter();
  const bufferString = datasets.join(",");
  let b64: string;
  if (bufferString == undefined || bufferString == "") {
    return [location.origin + location.pathname, ""];
  } else {
    b64 = encode(datasets.join(",") + `:::${start}:::${end}:::${legend_list.join(",")}`);
  }
  const sharelink_base = location.origin + location.pathname + "?b64=" + b64;
  return [sharelink_base, b64];
}

const decode = (str: string): string => atob(str);

const encode = (str: string): string => btoa(str);
