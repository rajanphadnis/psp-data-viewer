import { Component } from "solid-js";
import { StateType, useState } from "../../../../state";
import XMark from "../../../icons/x_mark";
import ColorPicker from "./color_picker";
import DatasetSelectorLegendIndicator from "./legend_indicator";

const DatasetSelector: Component<{ dataset_id: string }> = (props) => {
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
    <div class="flex w-full flex-row items-center justify-between p-0 py-1.5 text-white">
      <div class="flex flex-row items-center justify-start">
        <ColorPicker dataset_id={props.dataset_id} />
        <DatasetSelectorLegendIndicator dataset_id={props.dataset_id} />
        <p class="m-0 ml-1.5 text-sm font-stretch-condensed">
          {props.dataset_id.split("__")[0]} ({props.dataset_id.split("__")[1]})
        </p>
      </div>
      <button
        class="bg-rush hover:bg-aged mr-2 h-fit cursor-pointer border-none p-0"
        onclick={() => {
          removeDataset(props.dataset_id);
        }}
      >
        <XMark class="h-6 w-6 fill-white p-0.5" />
      </button>
    </div>
  );
};

export default DatasetSelector;
