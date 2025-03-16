/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { Firestore } from "firebase/firestore";
import "solid-devtools";
import { render } from "solid-js/web";
import App from "./App";
import { initFirebase } from "./db/firebase_init";
import "./index.css";
import { AppStateProvider } from "./state";

const root = document.getElementById("root");
declare global {
  var db: Firestore;
  var uplot: uPlot;
  var default_id: string;
}

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

// Initialize firebase
initFirebase();

render(() => {
  return (
    <AppStateProvider>
      <Router>
        <Route path="/:testID?" component={App}></Route>
      </Router>
    </AppStateProvider>
  );
}, root!);
