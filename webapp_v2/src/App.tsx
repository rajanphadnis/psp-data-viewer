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
import NavBarTitle from "./components/navbar/title";

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
    { addDataset, updateDataset, removeDataset },
  ]: any = useState();
  // const ctxt: any = useState();
  // let testBasics = ctxt.testBasics();
  onMount(async () => {
    // Contact the Firestore database and get the default test data
    await getGeneralTestInfo(useParams().testID, setAllKnownTests, setTestBasics, testBasics);
    await getTestInfo(testBasics().id, setTestBasics, setPlotRange);
    // const ctx: any = useState();
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
      console.log({
        start: start,
        end: end,
        datasets: datasets,
        test_id: test_id,
        legend_sides: legend_sides,
        plotColors: plotColors,
        displayed_samples: displayed_samples,
        axesSets: axesSets,
      });
      setLoadingState({ isLoading: true, statusMessage: "Diffing..." });
      await eventLoop(start, end, datasets, test_id, legend_sides, plotColors, displayed_samples, axesSets, setLoadingState, setPlotRange, testBasics, activeDatasets);
      setLoadingState({ isLoading: false, statusMessage: "" });
    } else {
      console.log("app not ready");
    }
  });

  return (
    <div class={styles.App}>
      <MetaProvider>
        <Show when={testBasics().id != ""} fallback={<Title>Loading...</Title>}>
          <Title>
            {testBasics().name}
          </Title>
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
