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
    { addDataset, updateDataset, removeDataset },
  ]: any = useState();
  createEffect(() => {
    console.log(activeDatasets().length == 0)
  });
  return (
    <div class={styles.plot} id="plot">
      <Show when={activeDatasets().length == 0}>
        <PlotOverlay />
      </Show>
    </div>
  );
};

export default Plot;
