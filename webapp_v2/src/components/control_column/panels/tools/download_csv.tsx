import { Component, createSignal, Show } from "solid-js";
import { downloadCSV } from "../../../../browser/csv";
import { delay } from "../../../../browser/util";
import { StateType, useState } from "../../../../state";
import CheckIcon from "../../../icons/check";
import IconCSV from "../../../icons/csv";
import IconButton from "./icon_button";
import styles from "./tools.module.css";

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
