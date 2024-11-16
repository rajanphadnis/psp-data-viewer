import { Component, createEffect, Show } from "solid-js";
import styles from "./plot.module.css";
import PlotOverlay from "./plot_overlay";
import { useState } from "../../state";

const Plot: Component<{}> = (props) => {
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
    <div class={styles.plot} id="plot">
      <Show when={activeDatasets().length == 0}>
        <PlotOverlay />
      </Show>
    </div>
  );
};

export default Plot;
