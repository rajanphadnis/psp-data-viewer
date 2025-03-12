import { MetaProvider, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { createEffect, onMount, Show, type Component } from "solid-js";
import styles from "./App.module.css";
import { loadFromShareLink } from "./browser/sharelink";
import ControlColumn from "./components/control_column/control_column";
import NavBar from "./components/navbar/navbar";
import Plot from "./components/plot/plot";
import { getGeneralTestInfo, getTestInfo } from "./db/db_interaction";
import { config } from "./generated_app_info";
import { eventLoop } from "./plotting/event_loop";
import { StateType, useState } from "./state";

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
    annotations,
    setAnnotations,
    {
      addDataset,
      updateDataset,
      removeDataset,
      updateColor,
    },
  ] = useState() as StateType;

  onMount(async () => {
    const s = document.createElement("script");
    s.setAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${config.firebase.measurementId}`);
    s.async = true;
    document.head.appendChild(s);
    const dataLayer = (window.dataLayer = window.dataLayer || []);
    function gtag(a: string, b: string | object) {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", config.firebase.measurementId);
    // Contact the Firestore database and get the default test data
    await getGeneralTestInfo(useParams().testID, setAllKnownTests, setTestBasics, testBasics);
    await getTestInfo(testBasics().id, setTestBasics, setPlotRange);
    loadFromShareLink(testBasics, setPlotRange, setDatasetsLegendSide, setActiveDatasets);
    setLoadingState({ isLoading: false, statusMessage: "" });
    setAppReadyState(true);
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
        setMeasuring,
        annotations,
        setAnnotations
      );
      setLoadingState({ isLoading: false, statusMessage: "" });
    } else {
      console.log("skipping re-render");
    }
  });

  return (
    <div class={styles.App}>
      <MetaProvider>
        <Show when={testBasics() != undefined ? testBasics().id != "" : false} fallback={<Title>Loading...</Title>}>
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
