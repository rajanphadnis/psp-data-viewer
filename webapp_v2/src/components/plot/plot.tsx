import { Component, Show } from "solid-js";
import { StateType, useState } from "../../state";
import PlotOverlay from "./plot_overlay";

const Plot: Component<{}> = (props) => {
  const [
    activeDatasets,
    setActiveDatasets,
    appReadyState,
    setAppReadyState,
    loadingState,
    setLoadingState,
    testBasics,
    setTestBasics,
    allKnownTests,
    setAllKnownTests,
    datasetsLegendSide,
    setDatasetsLegendSide,
    plotRange,
    setPlotRange,
    plotPalletteColors,
    setPlotPalletteColors,
    sitePreferences,
    setSitePreferences,
    loadingDatasets,
    setLoadingDatasets,
    measuring,
    setMeasuring,
    annotations,
    setAnnotations,
    currentAnnotation,
    setCurrentAnnotation,
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;
  return (
    <div
      class="bg-bg relative mr-auto ml-auto flex w-85/100 justify-center"
      id="plot"
    >
      <Show when={activeDatasets().length == 0}>
        <PlotOverlay />
      </Show>
    </div>
  );
};

export default Plot;
