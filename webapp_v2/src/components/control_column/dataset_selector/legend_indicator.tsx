import { Component, Show } from "solid-js";
import styles from "./dataset.selector.module.css";
import { useState } from "../../../state";
import { IconChevronLeft, IconChevronRight } from "../../icons/chevron";

const DatasetSelectorLegendIndicator: Component<{ dataset_id: string }> = (props) => {
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
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();

  return (
    <button
      class={styles.legendSelector}
      onclick={() => {
        updateDataset(props.dataset_id);
      }}
    >
      <div class={styles.iconDiv}
        style={datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)] % 2 == 1 ? "opacity: 1" : "opacity: 0"}
      >
        <IconChevronLeft />
      </div>

      {Math.ceil(datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)] / 2)}
      <div class={styles.iconDiv}
        style={datasetsLegendSide()[activeDatasets().indexOf(props.dataset_id)] % 2 == 0 ? "opacity: 1" : "opacity: 0"}
      >
        <IconChevronRight />
      </div>
    </button>
  );
};

export default DatasetSelectorLegendIndicator;
