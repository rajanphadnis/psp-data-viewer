/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App";
import { Route, Router } from "@solidjs/router";
import { Firestore } from "firebase/firestore";
import { Signal, createSignal, onMount } from "solid-js";
import { defaultPlottingColors } from "./theming";
import { LoadingStateType, TestBasics, Preferences, PlotRange } from "./types";
import { initFirebase } from "./db/firebase_init";
import "solid-devtools";
import { AppStateProvider } from "./state";

const root = document.getElementById("root");
// const init_loadingState: LoadingStateType = { isLoading: true, statusMessage: "Loading..." };
// const init_testData: TestBasics = {
//   name: "Loading...",
//   gse_article: "",
//   test_article: "",
//   id: "",
//   starting_timestamp: 0,
//   ending_timestamp: 0,
//   datasets: [""],
// };
// const init_Preferences: Preferences = {
//   displayedSamples: 4000,
//   axesSets: 6,
// };

declare global {
  var db: Firestore;
  var uplot: uPlot;
}

// export const [appReadyState, setAppReadyState]: Signal<boolean> = createSignal(false);
// export const [loadingState, setLoadingState]: Signal<LoadingStateType> = createSignal(init_loadingState);

// export const [testBasics, setTestBasics]: Signal<TestBasics> = createSignal(init_testData);
// export const [allKnownTests, setAllKnownTests]: Signal<TestBasics[]> = createSignal(new Array<TestBasics>());

// // export const [activeDatasets, setActiveDatasets]: Signal<string[]> = createSignal(new Array<string>());
// export const [datasetsLegendSide, setDatasetsLegendSide]: Signal<number[]> = createSignal(new Array<number>());

// export const [plotRange, setPlotRange]: Signal<PlotRange> = createSignal({ start: 0, end: 0 });
// export const [plotPalletteColors, setPlotPalletteColors]: Signal<string[]> = createSignal(defaultPlottingColors);

// export const [sitePreferences, setSitePreferences]: Signal<Preferences> = createSignal(init_Preferences);

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

// Initialize firebase
initFirebase();

render(() => {
  onMount(async () => {});

  return (
    <AppStateProvider>
      <Router>
        <Route path="/:testID?" component={App}></Route>
      </Router>
    </AppStateProvider>
  );
}, root!);
