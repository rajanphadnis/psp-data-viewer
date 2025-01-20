/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { Firestore } from "firebase/firestore";
import "solid-devtools";
import { initFirebase } from "./db/firebase_init";
import { AppStateProvider } from "./state";
import Header from "./components/header/header";
import MetaStuff from "./meta_stuff";
import { FirebaseStorage } from "firebase/storage";
import { Auth } from "firebase/auth";
import { AuthComponent } from "./components/auth/auth";


//ANJALI IS SO AWESOMEEEEEEE
const root = document.getElementById("root");

declare global {
  var db: Firestore;
  var storage: FirebaseStorage;
  var auth: Auth;
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
      <AuthComponent />
    </AppStateProvider>
  );
}, root!);
