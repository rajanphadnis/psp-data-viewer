import { MetaProvider, Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { createEffect, onMount, Show, type Component } from "solid-js";
import styles from "./App.module.css";
import { loadFromShareLink } from "./browser/sharelink";
import ControlColumn from "./components/control_column/control_column";
import NavBar from "./components/navbar/navbar";
import Plot from "./components/plot/plot";
import { getGeneralTestInfo, getTestInfo, startAnnotationListener } from "./db/db_interaction";
import { config } from "./generated_app_info";
import { eventLoop } from "./plotting/event_loop";
import { StateType, useState } from "./state";
import AnnotationModal from "./components/modal/annotation/modal";

const App: Component = (params) => {
  let annotationModalButton: HTMLButtonElement | undefined;
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
    const unsub = startAnnotationListener(testBasics().id, setAnnotations, setLoadingState);
    setLoadingState({ isLoading: false, statusMessage: "" });
    setAppReadyState(true);
    // console.log(annotationModalButton);
    annotationModalButton?.click();
  });

  createEffect(async () => {
    if (appReadyState()) {
      console.log(annotationModalButton);

      const start = plotRange().start;
      const end = plotRange().end;
      const datasets = activeDatasets();
      const test_id = testBasics().id;
      const legend_sides = datasetsLegendSide();
      const plotColors = plotPalletteColors();
      const displayed_samples = sitePreferences().displayedSamples;
      const axesSets = sitePreferences().axesSets;
      const measureData = measuring();
      const annotations_actual = annotations();
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
        annotations_actual,
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
      <AnnotationModal ref={annotationModalButton} />
      <div id="main">
        <Plot />
        <ControlColumn />
      </div>
    </div>
  );
};

export default App;
