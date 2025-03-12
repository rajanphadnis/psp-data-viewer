import { Component } from "solid-js";
import { StateType, useState } from "../../../../state";
import styles from "./dataset.selector.module.css";

const DatasetListSelector: Component<{ dataset_id: string }> = (props) => {
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
    <button
      class={styles.datasetButton}
      type="button"
      onClick={() => {
        addDataset(props.dataset_id);
      }}
    >
      {props.dataset_id.split("__")[0]} ({props.dataset_id.split("__")[1]})
    </button>
  );
};

export default DatasetListSelector;
