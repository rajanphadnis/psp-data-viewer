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
            console.log("zoom out");
            const zoomOutFactor = 2;
            const currentRange: PlotRange = plotRange();
            const testdata: TestBasics = testBasics();
            const center = (currentRange.start + currentRange.end) / 2;
            const range = currentRange.end! - currentRange.start;
            const delta = (range * zoomOutFactor) / 2;
            const start = center - delta;
            const end = center + delta;
            const min_converted = DateTime.fromMillis(start).setZone("utc", { keepLocalTime: false }).toMillis();
            const max_converted = DateTime.fromMillis(end).setZone("utc", { keepLocalTime: false }).toMillis();
            setPlotRange({
              start: Math.round(
                min_converted < testdata.starting_timestamp! ? testdata.starting_timestamp! : min_converted
              ),
              end: Math.round(max_converted > testdata.ending_timestamp! ? testdata.ending_timestamp! : max_converted),
            });

            // zoom to selection
            // globalThis.uplot.setScale("x", { min: start, max: end });
          }}
        >
          <IconZoomOut />
        </button>
        <button
          class={styles.zoomButton}
          onclick={() => {
            console.log("zoom in");
            const zoomInFactor = 0.5;
            const currentRange: PlotRange = plotRange();
            const testdata: TestBasics = testBasics();
            const center = (currentRange.start + currentRange.end) / 2;
            const range = currentRange.end! - currentRange.start;
            const delta = (range * zoomInFactor) / 2;
            const start = center - delta;
            const end = center + delta;
            const min_converted = DateTime.fromMillis(start).setZone("utc", { keepLocalTime: false }).toMillis();
            const max_converted = DateTime.fromMillis(end).setZone("utc", { keepLocalTime: false }).toMillis();
            setPlotRange({
              start: Math.round(
                min_converted < testdata.starting_timestamp! ? testdata.starting_timestamp! : min_converted
              ),
              end: Math.round(max_converted > testdata.ending_timestamp! ? testdata.ending_timestamp! : max_converted),
            });

            // zoom to selection
            // globalThis.uplot.setScale("x", { min: start, max: end });
          }}
        >
          <IconZoomIn />
        </button>
      </div>
    </Show>
  );
};

export default ZoomButtons;
