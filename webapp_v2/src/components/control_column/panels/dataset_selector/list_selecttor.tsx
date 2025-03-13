import { Component } from "solid-js";
import { StateType, useState } from "../../../../state";

const DatasetListSelector: Component<{ dataset_id: string }> = (props) => {
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
    <button
      class="hover:bg-cool-grey bg-bg text-xs flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25 py-2 text-start text-neutral-400 hover:text-white"
      type="button"
      onClick={() => {
        addDataset(props.dataset_id);
      }}
    >
      {props.dataset_id.split("__")[0]} ({props.dataset_id.split("__")[1]})
    </button>
  );
};

export default DatasetListSelector;
