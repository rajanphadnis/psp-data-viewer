import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { appKey } from "./generated_app_info";

const firebaseConfig = {
  apiKey: "AIzaSyDzZWBXQ5L9N92GRNUNGMse8AeUvbwFFyI",
  authDomain: "dataviewer-space.firebaseapp.com",
  projectId: "dataviewer-space",
  storageBucket: "dataviewer-space.firebasestorage.app",
  messagingSenderId: "267504321387",
  appId: "1:267504321387:web:9e3064ee3c72876352822e",
  measurementId: "G-07J83SCBTF",
};

/**
 * Initializes Firebase services, including App Check and Firestore
 *
 * @returns None
 *
 */
export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  globalThis.db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });

  globalThis.functions = getFunctions(app);
  if (appKey == "false") {
    console.log("in debug mode");
    // connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
}
