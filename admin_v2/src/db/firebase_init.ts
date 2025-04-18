import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { appCheckSecret, config } from "../generated_app_check_secret";

export const firebaseConfig = {
  apiKey: "AIzaSyDzZWBXQ5L9N92GRNUNGMse8AeUvbwFFyI",
  authDomain: "dataviewer-space.firebaseapp.com",
  projectId: "dataviewer-space",
  storageBucket: "dataviewer-space.firebasestorage.app",
  messagingSenderId: "267504321387",
  appId: "1:267504321387:web:54b41a98a46466cf52822e",
  measurementId: "G-Z8MPQGXT00",
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
  globalThis.adminDB = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  Object.keys(config).forEach((slug) => {
    globalThis.availableDBs[slug] = initializeFirestore(
      app,
      {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      },
      (config as any)[slug]["firebase"]["databaseID"],
    );
  });
  globalThis.storage = getStorage();
  globalThis.functions = getFunctions(app);
  globalThis.auth = getAuth(app);
  globalThis.auth.useDeviceLanguage();
  if (appCheckSecret != false) {
    console.log("in debug mode");
    // connectFunctionsEmulator(globalThis.functions, "localhost", 5001);
  }
}
