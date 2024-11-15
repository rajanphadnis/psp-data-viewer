import { Component, createSignal, Show } from "solid-js";
import styles from "./tools.module.css";
import IconButton from "./icon_button";
import IconCopy from "../../icons/copy";
import { plotSnapshot } from "../../../browser/image_tools";
import IconDownload from "../../icons/download";
import CheckIcon from "../../icons/check";
import { delay } from "../../../browser/util";
import IconCSV from "../../icons/csv";
import { downloadCSV } from "../../../browser/csv";
import { useState } from "../../../state";

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
