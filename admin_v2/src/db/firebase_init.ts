import { initializeApp } from "firebase/app";
import { ReCaptchaEnterpriseProvider, initializeAppCheck } from "firebase/app-check";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { appCheckSecret } from "../generated_app_check_secret";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzZWBXQ5L9N92GRNUNGMse8AeUvbwFFyI",
  authDomain: "dataviewer-space.firebaseapp.com",
  projectId: "dataviewer-space",
  storageBucket: "dataviewer-space.firebasestorage.app",
  messagingSenderId: "267504321387",
  appId: "1:267504321387:web:54b41a98a46466cf52822e",
  measurementId: "G-Z8MPQGXT00"
};

/**
 * Initializes Firebase services, including App Check and Firestore
 *
 * @returns None
 *
 */
export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  // initializeAppCheck(app, {
  //   provider: new ReCaptchaEnterpriseProvider("6Lctk8kpAAAAAI40QzMPFihZWMfGtiZ_-UC3H2n9"),
  //   isTokenAutoRefreshEnabled: true,
  // });
  globalThis.db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  }, "staging-1");
  globalThis.storage = getStorage();
  // functions = getFunctions(app);
  globalThis.auth = getAuth(app);
  globalThis.auth.useDeviceLanguage();
  if (appCheckSecret != false) {
    console.log("in debug mode");
    // connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
}
