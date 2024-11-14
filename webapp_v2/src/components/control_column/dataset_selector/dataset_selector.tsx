import { Component, createEffect, Show } from "solid-js";
import styles from "./dataset.selector.module.css";
import { useState } from "../../../state";
import DatasetListSelector from "./list_selecttor";
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
    // <Show
    //   when={activeDatasets().includes(props.dataset_id)}
    //   fallback={<DatasetListSelector dataset_id={props.dataset_id} />}
    // >

    // </Show>
    <div class={styles.datasetDiv}>
      <div class={styles.datasetLabelDiv}>
        <div
          class={styles.colorPicker}
          style={{ "background-color": plotPalletteColors()[activeDatasets().indexOf(props.dataset_id)] }}
        ></div>
        <p>{datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)]}</p>
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
