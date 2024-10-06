import { doc, Firestore, getDoc, type Unsubscribe } from "firebase/firestore";
import { initFirebase } from "./init/firebase_init";
import { updateStatus } from "./dom/status";
import { loadingStatus, type ProcedureStep } from "./browser/types";
import { initGlobalVars, initNavbar } from "./init/init";
import { login } from "./browser/login";
import type { Auth } from "firebase/auth";
import { procs } from "./procs/procs";
import { browser_checks } from "./browser/browser_interactions";

declare global {
  var db: Firestore;
  var steps_unsub: Unsubscribe;
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var visible_procs: number[];
  var general_unsub: Unsubscribe;
  var steps: ProcedureStep[];
  var step_titles: { [index: number]: string };
  var mission_name: string;
  var mission_id: string;
  var auth: Auth;
}

initGlobalVars();
initFirebase();
login();
initNavbar();
browser_checks();


async function main() {
  updateStatus(loadingStatus.LOADING, "Fetching");
  const div = document.getElementById("steps")! as HTMLDivElement;
  const docRef = doc(globalThis.db, "general", "missions");
  
  console.log(docRef);
  const docSnap = await getDoc(docRef);
  console.log("got doc");
  if (docSnap.exists()) {
    console.log("exists");
    div.innerHTML = "";
    const procs = docSnap.data()["procs"] as { [index: string]: string };
    for (const id of Object.keys(procs)) {
      const link = document.createElement("a");
      link.innerText = `${procs[id]} >`;
      link.href = `${location.origin}/procs/${id}`;
      div.appendChild(link);
    }
    updateStatus(loadingStatus.DONE);
  } else {
    // docSnap.data() will be undefined in this case
    updateStatus(loadingStatus.ERROR, "No Mission Info");
    div.innerHTML = "No missions found";
    console.log("No such document!");
    alert("Something went wrong - check your internet connection and try again");
  }
}


if (location.pathname.includes("/procs/")) {
  procs();
} else {
  if (location.pathname.includes("/seating/")) {
    // instanceManager();
    console.log("seating chart");
  } else {
    if (location.pathname.includes("/login/")) {
      login();
    } else {
      main();
    }
  }
}
