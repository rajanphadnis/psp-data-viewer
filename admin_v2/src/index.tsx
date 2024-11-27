/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Route, Router } from "@solidjs/router";
import { Firestore } from "firebase/firestore";
import { createSignal, onMount, Show } from "solid-js";
import "solid-devtools";
import { initFirebase } from "./db/firebase_init";
import { AppStateProvider, useState } from "./state";
import { MetaProvider, Title } from "@solidjs/meta";
import Header from "./components/header/header";
import styles from "./components/resizeable.module.css";
import Resizable from "@corvu/resizable";
import MetaStuff from "./meta_stuff";
import HomeComponent from "./components/home/home";
import { makePersisted } from "@solid-primitives/storage";
import Instances from "./components/instances/instances";
import MainLayout from "./components/layout";
import { FirebaseStorage } from "firebase/storage";

const root = document.getElementById("root");

declare global {
  var db: Firestore;
  var storage: FirebaseStorage;
  // var default_id: string;
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
      <MetaStuff />
      <Header />
      <MainLayout />
    </AppStateProvider>
  );
}, root!);
