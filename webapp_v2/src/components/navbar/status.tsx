import { Component, Show } from "solid-js";
import styles from "./navbar.module.css";
import CheckIcon from "../icons/check";
import { useState } from "../../state";

const Status: Component<{}> = (props) => {
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
    { addDataset, updateDataset, removeDataset },
  ]: any = useState();
  return (
    <div class={styles.status}>
      <p class={styles.statusMessage}>{loadingState().isLoading ? loadingState().statusMessage : "Ready"}</p>
      <Show
        when={loadingState().isLoading}
        fallback={
        // <span class={`material-symbols-outlined ${styles.green_check}`}>done</span>
        <CheckIcon/>
      }
      >
        <div class={styles.loader}></div>
      </Show>
    </div>
  );
};

export default Status;
