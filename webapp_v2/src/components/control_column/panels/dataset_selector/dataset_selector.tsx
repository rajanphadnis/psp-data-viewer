import { Component } from "solid-js";
import { StateType, useState } from "../../../../state";
import XMark from "../../../icons/x_mark";
import ColorPicker from "./color_picker";
import styles from "./dataset.selector.module.css";
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
    {
      addDataset,
      updateDataset,
      removeDataset,
      updateColor,
    },
  ] = useState() as StateType;


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
