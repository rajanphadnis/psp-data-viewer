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

declare global {
  var db: Firestore;
  var uplot: uPlot;
  var default_id: string;
}

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
