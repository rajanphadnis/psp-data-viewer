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
        // "9KS7qji1": "CMS Delta Coldflow",
        // "9KS7qji2": "CMS Delta Coldflow",
      },
    });
    await setDoc(doc(globalThis.db, "9KS7qji", "procedures"), {
      frozen: false,
      name: "CMS Delta Coldflow",
      section_headers: {
        1: "Prep",
        2: "Flow",
      },
      roles: {
        TOP: ["Rajan P", "Will", "Kylie"],
        TC: ["Nick"],
      },
    });
    const querySnapshot = await getDocs(collection(globalThis.db, "9KS7qji/procedures/steps"));
    querySnapshot.forEach(async (doc_read) => {
      await deleteDoc(doc_read.ref);
    });
    const querySnapshot2 = await getDocs(collection(globalThis.db, "9KS7qji/seating/charts"));
    querySnapshot2.forEach(async (doc_read) => {
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
      instructions: "START recording cameras",
      major_id: 1,
      minor_id: "003",
      operators: ["MEDIA"],
      status: "WRITTEN",
      status_detials: "by rphadnis",
    });

    await addDoc(collection(globalThis.db, "9KS7qji/procedures/steps"), {
      active: true,
      instructions: "CONFIRM attendence",
      major_id: 1,
      minor_id: "004",
      operators: ["DSO 1"],
      status: "WRITTEN",
      status_detials: "by rphadnis",
      is_substep: true,
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
    await addDoc(collection(globalThis.db, "9KS7qji/seating/charts"), {
      active: true,
      name: "ZL8 Control Room",
      chart: `[{"x":0,"y":0,"w":12,"noMove":true,"noResize":true,"locked":true,"content":"Desk"},{"x":0,"y":1,"w":2,"h":2,"content":"<span>None</span>"},{"x":2,"y":1,"w":2,"h":2,"content":"<span>None</span>"},{"x":4,"y":1,"w":2,"h":2,"content":"<span>None</span>"},{"w":2,"h":2,"x":6,"y":1,"content":"<span>TOP<br><br>Person Name</span>"},{"x":8,"y":1,"h":2,"minW":2,"noResize":true,"content":"cannot resize"},{"x":10,"y":1,"w":2,"h":2,"content":"<span>None</span>"},{"w":2,"h":2,"x":6,"y":4,"content":"<span>None</span>"},{"x":8,"y":4,"w":2,"h":2,"content":"<span>None</span>"},{"x":10,"y":4,"w":2,"h":2,"content":"<span>None</span>"},{"x":0,"y":5,"w":2,"h":2,"content":"<span>None</span>"},{"x":2,"y":6,"w":2,"noMove":true,"noResize":true,"locked":true,"content":"<span>Door</span>"},{"x":6,"y":6,"w":6,"noMove":true,"noResize":true,"locked":true,"content":"<span>Desk</span>"}]`,
    });

    await addDoc(collection(globalThis.db, "9KS7qji/seating/charts"), {
      active: true,
      name: "ZL3 Control Room",
      chart: `[{"x":0,"y":0,"w":12,"noMove":true,"noResize":true,"locked":true,"content":"<span>Desk</span>"},{"x":2,"y":1,"w":2,"h":2,"content":"<span>8</span>"},{"x":4,"y":1,"w":2,"h":2,"content":"<span>9</span>"},{"w":2,"h":2,"x":6,"y":1,"content":"<span><span>TOP<br><br>Person Name</span></span>"},{"x":8,"y":1,"h":2,"minW":2,"noResize":true,"content":"<span>cannot resize</span>"},{"x":10,"y":1,"w":2,"h":2,"content":"<span>4</span>"},{"x":0,"y":2,"h":2,"noMove":true,"noResize":true,"locked":true,"content":"<span>Door</span>"},{"x":3,"y":3,"w":2,"h":2,"content":"<span>5</span>"},{"x":7,"y":3,"w":2,"h":2,"content":"<span>10</span>"},{"x":9,"y":3,"w":2,"h":2,"content":"<span>11</span>"}]`,
    });
  }
}
