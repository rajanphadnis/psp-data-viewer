import { initializeApp } from "firebase/app";
import { ReCaptchaEnterpriseProvider, initializeAppCheck } from "firebase/app-check";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { appCheckSecret } from "./generated_app_check_secret";

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
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
}
