import { Component } from "solid-js";
import { StateType, useState } from "../../../../state";
import { IconChevronLeft, IconChevronRight } from "../../../icons/chevron";

const DatasetSelectorLegendIndicator: Component<{ dataset_id: string }> = (
  props,
) => {
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
    <button
      class="m-0 flex cursor-pointer flex-row items-center justify-center rounded-lg border border-white bg-transparent px-0.75 text-white"
      onclick={() => {
        updateDataset(props.dataset_id);
      }}
    >
      <div
        class="m-0 flex flex-row items-center justify-center p-0"
        style={
          datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)] %
            2 ==
          1
            ? "opacity: 1"
            : "opacity: 0"
        }
      >
        <IconChevronLeft class="w-1.75 fill-white" />
      </div>

      {Math.ceil(
        datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)] / 2,
      )}
      <div
        class="m-0 flex flex-row items-center justify-center p-0"
        style={
          datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)] %
            2 ==
          0
            ? "opacity: 1"
            : "opacity: 0"
        }
      >
        <IconChevronRight class="w-1.75 fill-white" />
      </div>
    </button>
  );
};

export default DatasetSelectorLegendIndicator;
