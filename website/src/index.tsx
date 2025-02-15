/* @refresh reload */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";

import "./index.css";
import { AppStateProvider } from "./state";
import Home from "./pages/home";
import { Firestore } from "firebase/firestore";
import { initFirebase } from "./firebase";
import Status from "./pages/status";

const root = document.getElementById("root");

declare global {
  var db: Firestore;
}

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

initFirebase();

render(() => {
  return (
    <AppStateProvider>
      <Router>
        <Route path="/" component={Home}></Route>
        <Route path={"/status"} component={Status}></Route>
      </Router>
    </AppStateProvider>
  );
}, root!);
