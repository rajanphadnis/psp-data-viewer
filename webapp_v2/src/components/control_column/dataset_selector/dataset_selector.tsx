import { Component } from "solid-js";
import styles from "./dataset.selector.module.css";
import { useState } from "../../../state";
import XMark from "../../icons/x_mark";

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
    <div class={styles.datasetDiv}>
      <div class={styles.datasetLabelDiv}>
        <div
          class={styles.colorPicker}
          style={{ "background-color": plotPalletteColors()[activeDatasets().indexOf(props.dataset_id)] }}
        ></div>
        <button class={styles.legendSelector} onclick={() => {
          updateDataset(props.dataset_id);
        }}>{datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)]}</button>
        <p class={styles.label}>
          {props.dataset_id.split("__")[0]} ({props.dataset_id.split("__")[1]})
        </p>
      </div>
      <button
        class={styles.removeButton}
        onclick={() => {
          removeDataset(props.dataset_id);
        }}
      >
        <XMark />
      </button>
    </div>
  );
};

export default DatasetSelector;
