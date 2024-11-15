import { Component, createSignal } from "solid-js";
import styles from "./dataset.selector.module.css";
import { useState } from "../../../state";
import XMark from "../../icons/x_mark";
import DatasetSelectorLegendIndicator from "./legend_indicator";
import ColorPicker from "./color_picker";
import useClickOutside from "../../../browser/click_outside";

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
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();
  

  return (
    <div class={styles.datasetDiv}>
      <div class={styles.datasetLabelDiv}>
        <ColorPicker dataset_id={props.dataset_id} />
        {/* <div
          class={styles.colorPicker}
          style={{ "background-color": plotPalletteColors()[activeDatasets().indexOf(props.dataset_id)] }}
        ></div> */}
        <DatasetSelectorLegendIndicator dataset_id={props.dataset_id} />
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
