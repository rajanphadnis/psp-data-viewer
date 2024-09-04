import { ReCaptchaEnterpriseProvider, initializeAppCheck } from "firebase/app-check";
import { connectFirestoreEmulator, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { appCheckSecret } from "./generated_app_check_secret";
import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAmJytERQ1hnORHswd-j07WhpTYH7yu6fA",
  authDomain: "psp-portfolio-f1205.firebaseapp.com",
  projectId: "psp-portfolio-f1205",
  storageBucket: "psp-portfolio-f1205.appspot.com",
  messagingSenderId: "493859450932",
  appId: "1:493859450932:web:e4e3c67f0f46316c555a61",
};

export function initFirebase() {
  const app = initializeApp(firebaseConfig);
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckSecret;
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6Lctk8kpAAAAAI40QzMPFihZWMfGtiZ_-UC3H2n9"),
    isTokenAutoRefreshEnabled: true,
  });
  globalThis.db = initializeFirestore(app, {
    // localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  globalThis.functions = getFunctions(app);
  globalThis.storage = getStorage();
  if (appCheckSecret != false) {
    console.log("in debug mode");
    // connectFunctionsEmulator(globalThis.functions, "127.0.0.1", 5001);
    // connectStorageEmulator(globalThis.storage, "127.0.0.1", 9199);
    // connectFirestoreEmulator(globalThis.db, "127.0.0.1", 8080);
  }
}
