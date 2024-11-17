import Resizable from "corvu/resizable";
import { Component, For } from "solid-js";
import DatasetListSelector from "./dataset_selector/list_selecttor";
import { useState } from "../../../state";
import styles from "../column.module.css";

const PanelDatasetSelector: Component<{}> = (props) => {
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
    <Resizable.Panel class={styles.panel} minSize={0.25} collapsedSize={0.025} collapsible={true}>
      <div class={styles.titleDiv}>
        <h3 class={styles.title}>Available Datasets:</h3>
      </div>
      <For
        each={
          testBasics().datasets != undefined
            ? testBasics().datasets.filter((element: string[]) => !activeDatasets().includes(element))
            : []
        }
      >
        {(item, index) => <DatasetListSelector dataset_id={item} />}
      </For>
    </Resizable.Panel>
  );
};

export default PanelDatasetSelector;
