import { Component, Show } from "solid-js";
import styles from "./column.module.css";
import { IconZoomIn, IconZoomOut } from "../icons/zoom";
import { useState } from "../../state";
import { PlotRange, TestBasics } from "../../types";
import { DateTime } from "luxon";

const ZoomButtons: Component<{}> = (props) => {
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
    <Show when={activeDatasets().length > 0}>
      <div class={styles.zoomButtonDiv}>
        <button
          class={styles.zoomButton}
          onclick={() => {
            console.log("zoom out click");
            const [start, end] = genZoomBounds(2, plotRange(), testBasics());
            setPlotRange({
              start: start,
              end: end,
            });
          }}
        >
          <IconZoomOut />
        </button>
        <button
          class={styles.zoomButton}
          onclick={() => {
            console.log("zoom in click");
            const [start, end] = genZoomBounds(0.5, plotRange(), testBasics());
            setPlotRange({
              start: start,
              end: end,
            });
          }}
        >
          <IconZoomIn />
        </button>
      </div>
    </Show>
  );
};

export default ZoomButtons;

function genZoomBounds(zoomFactor: number, currentRange: PlotRange, testdata: TestBasics): number[] {
  const center = (currentRange.start + currentRange.end) / 2;
  const range = currentRange.end! - currentRange.start;
  const delta = (range * zoomFactor) / 2;
  const start = center - delta;
  const end = center + delta;
  const start_toReturn = Math.round(start < testdata.starting_timestamp! ? testdata.starting_timestamp! : start);
  const end_toReturn = Math.round(end > testdata.ending_timestamp! ? testdata.ending_timestamp! : end);
  return [start_toReturn, end_toReturn];
}
