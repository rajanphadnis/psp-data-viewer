import { Component, For } from "solid-js";
import styles from "./column.module.css";
import DatasetSelector from "./dataset_selector/dataset_selector";
import { useState } from "../../state";

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
    { addDataset, updateDataset, removeDataset },
  ]: any = useState();
  return (
    <div class={styles.datasetSelector}>
      <For each={testBasics().datasets}>
        {(item, index) => (
          // rendering logic for each element
          <DatasetSelector dataset_id={item}></DatasetSelector>
        )}
      </For>
    </div>
  );
};

export default ControlColumn;
