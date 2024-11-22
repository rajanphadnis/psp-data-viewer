import { Component, createMemo, createSignal, Show } from "solid-js";
import styles from "./column.module.css";
import { IconZoomIn, IconZoomOut } from "../icons/zoom";
import { useState } from "../../state";
import { PlotRange, TestBasics } from "../../types";
import { DateTime } from "luxon";
import { eventLoop } from "../../plotting/event_loop";

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

  const zoomRanges = createMemo<number[]>(() => {
    const [inStart, inEnd] = genZoomBounds(0.5, plotRange(), testBasics());
    const [outStart, outEnd] = genZoomBounds(2, plotRange(), testBasics());
    return [inStart, inEnd, outStart, outEnd];
  });

  const [isLoadingOut, setIsLoadingOut] = createSignal<boolean>(false);
  const [isLoadingIn, setIsLoadingIn] = createSignal<boolean>(false);

  return (
    <Show when={activeDatasets().length > 0}>
      <div class={styles.zoomButtonDiv}>
        <button
          class={styles.zoomButton}
          onclick={() => {
            console.log("zoom out click");
            setPlotRange({
              start: zoomRanges()[2],
              end: zoomRanges()[3],
            });
          }}
          onmouseenter={async () => {
            console.log("prefetching");
            setIsLoadingOut(true);
            const datasets = activeDatasets();
            const test_id = testBasics().id;
            const legend_sides = datasetsLegendSide();
            const plotColors = plotPalletteColors();
            const displayed_samples = sitePreferences().displayedSamples;
            const axesSets = sitePreferences().axesSets;
            await eventLoop(
              zoomRanges()[2],
              zoomRanges()[3],
              datasets,
              test_id,
              legend_sides,
              plotColors,
              displayed_samples,
              axesSets,
              setLoadingState,
              setPlotRange,
              testBasics,
              activeDatasets,
              measuring,
              setMeasuring,
              true
            );
            setIsLoadingOut(false);
          }}
        >
          <IconZoomOut />
          <Show when={isLoadingOut()}>
            <div class={styles.loader}></div>
          </Show>
        </button>
        <button
          class={styles.zoomButton}
          onclick={() => {
            console.log("zoom in click");
            setPlotRange({
              start: zoomRanges()[0],
              end: zoomRanges()[1],
            });
          }}
          onmouseenter={async () => {
            console.log("prefetching");
            setIsLoadingIn(true);
            const datasets = activeDatasets();
            const test_id = testBasics().id;
            const legend_sides = datasetsLegendSide();
            const plotColors = plotPalletteColors();
            const displayed_samples = sitePreferences().displayedSamples;
            const axesSets = sitePreferences().axesSets;
            await eventLoop(
              zoomRanges()[0],
              zoomRanges()[1],
              datasets,
              test_id,
              legend_sides,
              plotColors,
              displayed_samples,
              axesSets,
              setLoadingState,
              setPlotRange,
              testBasics,
              activeDatasets,
              measuring,
              setMeasuring,
              true
            );
            setIsLoadingIn(false);
          }}
        >
          <IconZoomIn />
          <Show when={isLoadingIn()}>
            <div class={styles.loader}></div>
          </Show>
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
