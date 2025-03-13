import { Component, Show } from "solid-js";
import { StateType, useState } from "../../state";
import CheckIcon from "../icons/check";

const Status: Component<{}> = (props) => {
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
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;

  return (
    <div class="flex flex-row items-center justify-end pr-5 text-center">
      <p class="m-auto pr-2.5">
        {loadingState().isLoading ? loadingState().statusMessage : "Ready"}
      </p>
      <Show
        when={loadingState().isLoading}
        fallback={<CheckIcon class="w-5 fill-lime-400" />}
      >
        <div class="loader"></div>
      </Show>
    </div>
  );
};

export default Status;
