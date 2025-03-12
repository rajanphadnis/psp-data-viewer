import Resizable from "corvu/resizable";
import { Component, For, Show } from "solid-js";
import styles from "../column.module.css";
import NoDatasetsMessage from "../no_datasets";
import { StateType, useState } from "../../../state";
import DatasetSelector from "./dataset_selector/dataset_selector";

const PanelActiveDatasets: Component<{}> = (props) => {
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
    <Resizable.Panel class={styles.panel} minSize={0.1} collapsedSize={0.025} collapsible={false}>
      <div class={styles.titleDiv}>
        <h3 class={styles.title}>Active Datasets:</h3>
      </div>
      <Show when={activeDatasets().length > 0} fallback={<NoDatasetsMessage><p>No Datasets Selected</p></NoDatasetsMessage>}>
        <For each={activeDatasets()}>{(item, index) => <DatasetSelector dataset_id={item}></DatasetSelector>}</For>
      </Show>
    </Resizable.Panel>
  );
};

export default PanelActiveDatasets;
