import { Component, Show } from "solid-js";
import styles from "../column.module.css";
import Resizable from "corvu/resizable";
import NoDatasetsMessage from "../no_datasets";
import ToolCopyImage from "./tools/copy_image";
import ToolDownloadCSV from "./tools/download_csv";
import ToolDownloadImage from "./tools/download_image";
import ToolMeasure from "./tools/measure";
import { useState } from "../../../state";
import ToolCalcChannel from "./tools/calc_channels";
import ToolEasterEgg from "./tools/easter";

const PanelTools: Component<{}> = (props) => {
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
    <Resizable.Panel class={styles.panel} minSize={0.15} collapsedSize={0.025} collapsible={true}>
      <div class={styles.titleDiv}>
        <h3 class={styles.title}>Tools:</h3>
      </div>
      <Show when={activeDatasets().length > 0} fallback={<NoDatasetsMessage />}>
        <ToolCopyImage />
        <ToolDownloadImage />
        <ToolDownloadCSV />
        <ToolMeasure />
        <ToolCalcChannel />
        <Show when={activeDatasets().length > 2}>
          <ToolEasterEgg />
        </Show>
      </Show>
    </Resizable.Panel>
  );
};

export default PanelTools;
