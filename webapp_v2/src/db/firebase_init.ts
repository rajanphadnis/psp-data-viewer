import { initializeApp } from "firebase/app";
import { ReCaptchaEnterpriseProvider, initializeAppCheck } from "firebase/app-check";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { appCheckSecret, config } from "../generated_app_info";

const firebaseConfig = {
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
  measurementId: config.firebase.measurementId
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
  }, config.firebase.databaseID);

  // functions = getFunctions(app);
  if (appCheckSecret != false) {
    console.log("in debug mode");
    // connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
}
