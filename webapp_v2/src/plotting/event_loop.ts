import { AlignedData } from "uplot";
import { storeActiveDatasets } from "../browser/caching";
import { DatasetSeries, LoadingStateType, MeasureData, PlotRange, TestBasics } from "../types";
import { generatePlottedDatasets } from "./dataset_generation";
import { plot } from "./plotting_helpers";
import { Accessor, createEffect, Setter } from "solid-js";

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
  measuring: Accessor<MeasureData>,
  setMeasurement: Setter<MeasureData>,
  prefetch: boolean = false
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
    prefetch
  );
  storeActiveDatasets(generated_toPlot, datasets, startTimestamp, endTimestamp, legend_sides);
  const displayedAxes = generated_series.slice(1).map((s, i) => {
    const thing = s as DatasetSeries;
    return thing.scale;
  });
  if (!prefetch) {
    plot(
      generated_toPlot as AlignedData,
      generated_series,
      axesSets,
      setPlotRange,
      testBasics,
      activeDatasets,
      measuring,
      displayedAxes,
      setMeasurement,
      legend_sides
    );
  }
}
