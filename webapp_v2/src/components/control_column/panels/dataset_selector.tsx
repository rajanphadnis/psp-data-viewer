import Resizable from "corvu/resizable";
import { Component, For, Show } from "solid-js";
import { StateType, useState } from "../../../state";
import NoDatasetsMessage from "../no_datasets";
import DatasetListSelector from "./dataset_selector/list_selecttor";

const PanelDatasetSelector: Component<{}> = (props) => {
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
    <Resizable.Panel
      class="overflow-auto"
      minSize={0.25}
      collapsedSize={0.025}
      collapsible={false}
    >
      <div class="flex w-full flex-row items-center justify-start pb-1.25">
        <h3 class="m-0 font-bold">Available Datasets:</h3>
      </div>
      <Show
        when={
          testBasics() != undefined
            ? testBasics().datasets != undefined
              ? activeDatasets().length != testBasics().datasets!.length
              : false
            : false
        }
        fallback={
          <NoDatasetsMessage>
            <p class="m-0 px-2.5">None</p>
          </NoDatasetsMessage>
        }
      >
        <For
          each={
            testBasics().datasets != undefined
              ? testBasics().datasets!.filter(
                  (element) => !activeDatasets().includes(element),
                )
              : []
          }
        >
          {(item, index) => <DatasetListSelector dataset_id={item} />}
        </For>
      </Show>
    </Resizable.Panel>
  );
};

export default PanelDatasetSelector;
