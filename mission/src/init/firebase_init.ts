import { ReCaptchaEnterpriseProvider, initializeAppCheck } from "firebase/app-check";
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDocs,
  initializeFirestore,
  setDoc,
} from "firebase/firestore";
import { appCheckSecret } from "../generated_app_info";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmJytERQ1hnORHswd-j07WhpTYH7yu6fA",
  authDomain: window.location.host,
  // authDomain: "localhost",
  projectId: "psp-portfolio-f1205",
  storageBucket: "psp-portfolio-f1205.appspot.com",
  messagingSenderId: "493859450932",
  appId: "1:493859450932:web:e4e3c67f0f46316c555a61",
};

export async function initFirebase() {
  const app = initializeApp(firebaseConfig);
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = appCheckSecret;
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6Lctk8kpAAAAAI40QzMPFihZWMfGtiZ_-UC3H2n9"),
    isTokenAutoRefreshEnabled: true,
  });
  globalThis.db = initializeFirestore(app, {}, "mission-management");
  globalThis.auth = getAuth(app);
  if (appCheckSecret != false) {
    console.log("in debug mode");
    connectAuthEmulator(globalThis.auth, "http://127.0.0.1:9099", { disableWarnings: true });
    // connectFunctionsEmulator(globalThis.functions, "127.0.0.1", 5001);
    // connectStorageEmulator(globalThis.storage, "127.0.0.1", 9199);
    connectFirestoreEmulator(globalThis.db, "127.0.0.1", 8080);
    await setDoc(doc(globalThis.db, "general", "missions"), {
      default: "9KS7qji",
      procs: {
        "9KS7qji": "CMS Delta Coldflow",
      },
    });
    await setDoc(doc(globalThis.db, "9KS7qji", "procedures"), {
      frozen: false,
      name: "CMS Delta Coldflow",
      section_headers: {
        1: "Prep",
        2: "Flow",
      },
    });
    const querySnapshot = await getDocs(collection(globalThis.db, "9KS7qji/procedures/steps"));
    querySnapshot.forEach(async (doc_read) => {
      await deleteDoc(doc_read.ref);
    });
    await addDoc(collection(globalThis.db, "9KS7qji/procedures/steps"), {
      active: true,
      instructions: "OPEN PV-N2-01",
      major_id: 1,
      minor_id: "001",
      operators: ["TOP"],
      status: "COMPLETED",
      status_detials: "by rphadnis",
    });
    await addDoc(collection(globalThis.db, "9KS7qji/procedures/steps"), {
      active: true,
      instructions: "CLOSE PV-N2-01",
      major_id: 1,
      minor_id: "002",
      operators: ["TOP", "TC"],
      status: "WIP",
      status_detials: "by rphadnis",
    });
    await addDoc(collection(globalThis.db, "9KS7qji/procedures/steps"), {
      active: true,
      instructions: "Record Weather",
      major_id: 2,
      minor_id: "001",
      operators: ["TOP"],
      status: "COMPLETED",
      status_detials: "by rphadnis",
    });
  }
}
