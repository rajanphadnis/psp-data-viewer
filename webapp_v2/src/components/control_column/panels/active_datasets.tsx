import Resizable from "corvu/resizable";
import { Component, For, Show } from "solid-js";
import { StateType, useState } from "../../../state";
import NoDatasetsMessage from "../no_datasets";
import DatasetSelector from "./dataset_selector/dataset_selector";

const PanelActiveDatasets: Component<{}> = (props) => {
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
    <Resizable.Panel
      class="overflow-auto"
      minSize={0.1}
      collapsedSize={0.025}
      collapsible={false}
    >
      <div class="flex w-full flex-row items-center justify-start pb-1.25">
        <h3 class="m-0 font-bold">Active Datasets:</h3>
      </div>
      <Show
        when={activeDatasets().length > 0}
        fallback={
          <NoDatasetsMessage>
            <p class="m-0 px-2.5">No Datasets Selected</p>
          </NoDatasetsMessage>
        }
      >
        <For each={activeDatasets()}>
          {(item, index) => (
            <DatasetSelector dataset_id={item}></DatasetSelector>
          )}
        </For>
      </Show>
    </Resizable.Panel>
  );
};

export default PanelActiveDatasets;
