import { Component, Show } from "solid-js";
import { StateType, useState } from "../../state";
import styles from "./plot.module.css";
import PlotOverlay from "./plot_overlay";

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
    <div class={styles.plot} id="plot">
      <Show when={activeDatasets().length == 0}>
        <PlotOverlay />
      </Show>
    </div>
  );
};

export default Plot;
