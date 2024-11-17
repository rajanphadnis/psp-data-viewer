import { Component, createSignal, Show } from "solid-js";
import styles from "./tools.module.css";
import IconButton from "./icon_button";
import { downloadCSV } from "../../../../browser/csv";
import { delay } from "../../../../browser/util";
import { useState } from "../../../../state";
import CheckIcon from "../../../icons/check";
import IconCSV from "../../../icons/csv";

const ToolDownloadCSV: Component<{}> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);
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
      class={styles.button}
      onclick={async () => {
        downloadCSV(activeDatasets(), plotRange().start, plotRange().end);
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <IconButton>
        <Show when={!showDone()} fallback={<CheckIcon />}>
          <IconCSV />
        </Show>
      </IconButton>
      <p class={styles.buttonTitle}>
        <Show when={!showDone()} fallback={"Downloaded!"}>
          Download Data as CSV
        </Show>
      </p>
    </button>
  );
};

export default ToolDownloadCSV;
