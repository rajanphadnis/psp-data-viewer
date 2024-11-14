import { AlignedData } from "uplot";
import { storeActiveDatasets } from "../browser/caching";
import { DatasetSeries, LoadingStateType, PlotRange, TestBasics } from "../types";
import { generatePlottedDatasets } from "./dataset_generation";
import { plot } from "./plotting_helpers";
import { Accessor, createEffect, Setter } from "solid-js";
// import { useCounter } from "../App";

// export async function update() {

// }

export async function eventLoop(
  startTimestamp: number,
  endTimestamp: number,
  datasets: string[],
  test_id: string,
  legend_sides: number[],
  plotColors: string[],
  displayed_samples: number,
  axesSets: number,
  setLoadingState: Setter<LoadingStateType>,
  setPlotRange: Setter<PlotRange>,
  testBasics: Accessor<TestBasics>,
  activeDatasets: Accessor<string[]>,
) {
  const [generated_toPlot, generated_series] = await generatePlottedDatasets(
    datasets,
    startTimestamp,
    endTimestamp,
    test_id,
    legend_sides,
    plotColors,
    displayed_samples,
    setLoadingState,
  );
  storeActiveDatasets(generated_toPlot, datasets);
  plot(generated_toPlot as AlignedData, generated_series, axesSets, setPlotRange, testBasics, activeDatasets);
  // setLoadingState({ isLoading: true, statusMessage: "Diffing..." });
  // const [activeDatasets, setActiveDatasets, { buttonClickHandler }]: any = useCounter();
  // const [toPlot, series] = runCalcsEngine(generated_toPlot, generated_series);
  // globalThis.plotDisplayedAxes = generated_series.slice(1).map((s, i) => {
  //   const thing = s as DatasetSeries;
  //   return thing.scale;
  // });

  // if (toPlot.length > 1) {
  //   // Save dT to global variable
  //   globalThis.calcChannelDt_seconds = toPlot[0][1] - toPlot[0][0];
  // }
  // setLoadingState({ isLoading: true, statusMessage: "Plotting..." });
  // setPlotRange({ start: startTimestamp, end: endTimestamp });
  // setActiveDatasets()
  // globalThis.displayedRangeStart = startTimestamp;
  // globalThis.displayedRangeEnd = endTimestamp;
  // writeSelectorList(globalThis.activeDatasets_all);
  // updateAvailableFeatures();
  // setLoadingState({ isLoading: false, statusMessage: "" });
}
