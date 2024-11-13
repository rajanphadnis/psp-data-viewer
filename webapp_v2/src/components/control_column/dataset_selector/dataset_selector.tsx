import { Component, Show } from "solid-js";
import styles from "./dataset.selector.module.css";
import { useState } from "../../../state";

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
    { addDataset, updateDataset, removeDataset },
  ]: any = useState();
  return (
    <Show
      when={activeDatasets().includes(props.dataset_id)}
      fallback={
        <button
          class={styles.datasetButton}
          type="button"
          onClick={() => {
            addDataset(props.dataset_id);
          }}
        >
          {props.dataset_id.split("__")[0]} ({props.dataset_id.split("__")[1]})
        </button>
      }
    >
      <p>{props.dataset_id}</p>
    </Show>
  );
};

export default DatasetSelector;
