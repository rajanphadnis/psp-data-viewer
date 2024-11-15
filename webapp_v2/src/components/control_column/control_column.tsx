import { Component, For, Show } from "solid-js";
import styles from "./column.module.css";
import DatasetSelector from "./dataset_selector/dataset_selector";
import { useState } from "../../state";
import DatasetListSelector from "./dataset_selector/list_selecttor";

const ControlColumn: Component<{}> = (props) => {
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
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();
  return (
    <div class={styles.datasetSelector}>
      <For each={activeDatasets()}>
        {(item, index) => (
          // rendering logic for each element
          <DatasetSelector dataset_id={item}></DatasetSelector>
        )}
      </For>
      <Show when={activeDatasets().length > 0}>
        <hr class={styles.hr}/>
      </Show>
      <For
        each={
          testBasics().datasets != undefined
            ? testBasics().datasets.filter((element: string[]) => !activeDatasets().includes(element))
            : []
        }
      >
        {(item, index) => (
          // rendering logic for each element
          <DatasetListSelector dataset_id={item} />
          // <DatasetSelector dataset_id={item}></DatasetSelector>
        )}
      </For>
    </div>
  );
};

export default ControlColumn;
