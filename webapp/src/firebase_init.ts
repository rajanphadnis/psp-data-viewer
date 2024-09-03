import { initializeApp } from "firebase/app";
import { ReCaptchaEnterpriseProvider, initializeAppCheck } from "firebase/app-check";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { appCheckSecret } from "./generated_app_info";
// import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

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
  self.globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckSecret;
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6Lctk8kpAAAAAI40QzMPFihZWMfGtiZ_-UC3H2n9"),
    isTokenAutoRefreshEnabled: true,
  });
  globalThis.db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });

  // functions = getFunctions(app);
  if (appCheckSecret != false) {
    console.log("in debug mode");
    // connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
}
