import { createEffect, onMount, Show, type Component } from "solid-js";
import styles from "./App.module.css";
import NavBar from "./components/navbar/navbar";
import { getGeneralTestInfo, getTestInfo } from "./db/db_interaction";
import { useParams } from "@solidjs/router";
import { MetaProvider, Title } from "@solidjs/meta";
import Plot from "./components/plot/plot";
import ControlColumn from "./components/control_column/control_column";
import { loadFromShareLink } from "./browser/sharelink";
import { useState } from "./state";
import { eventLoop } from "./plotting/event_loop";
import { clearDatums, setPoint1, setPoint2 } from "./browser/measure";

const App: Component = (params) => {
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
  onMount(async () => {
    // Contact the Firestore database and get the default test data
    await getGeneralTestInfo(useParams().testID, setAllKnownTests, setTestBasics, testBasics);
    await getTestInfo(testBasics().id, setTestBasics, setPlotRange);
    loadFromShareLink(testBasics, setPlotRange, setDatasetsLegendSide, setActiveDatasets);
    setLoadingState({ isLoading: false, statusMessage: "" });
    setAppReadyState(true);
    // window.addEventListener("keydown", (e) => {
    //   if (e && e.key == "1") {
    //     console.log("1");
    //     console.log(measuring);
    //     setPoint1(activeDatasets(), measuring, setMeasuring, datasetsLegendSide);
    //   }
    //   if (e && e.key == "2") {
    //     console.log("2");
    //     console.log(measuring);
    //     setPoint2(activeDatasets(), measuring, setMeasuring, datasetsLegendSide);
    //   }
    //   // if (e && e.key == "ESC") {
    //   //   console.log("esc");
    //   //   clearDatums(u, measuring, setMeasuring);
    //   // }
    // });
  });

  createEffect(async () => {
    if (appReadyState()) {
      const start = plotRange().start;
      const end = plotRange().end;
      const datasets = activeDatasets();
      const test_id = testBasics().id;
      const legend_sides = datasetsLegendSide();
      const plotColors = plotPalletteColors();
      const displayed_samples = sitePreferences().displayedSamples;
      const axesSets = sitePreferences().axesSets;
      const measureData = measuring();
      setLoadingState({ isLoading: true, statusMessage: "Generating..." });
      // if (datasets.length == legend_sides.length && datasets.length == 0) {
      //   console.log("clearing datums");
      //   clearDatums(globalThis.uplot, measureData, setMeasuring);
      // }
      await eventLoop(
        start,
        end,
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
        setMeasuring
      );
      setLoadingState({ isLoading: false, statusMessage: "" });
    } else {
      console.log("skipping re-render");
    }
  });

  return (
    <div class={styles.App}>
      <MetaProvider>
        <Show when={testBasics().id != ""} fallback={<Title>Loading...</Title>}>
          <Title>{testBasics().name}</Title>
        </Show>
      </MetaProvider>
      <NavBar />
      <div id="main">
        <Plot />
        <ControlColumn />
      </div>
    </div>
  );
};

export default App;
