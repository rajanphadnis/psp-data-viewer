import { doc, Firestore, getDoc, type Unsubscribe } from "firebase/firestore";
import { initFirebase } from "./firebase_init";
import { updateStatus } from "./status";
import { loadingStatus, type ProcedureStep } from "./types";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { update_procs } from "./draw_steps";
import { initGlobalVars, initNavbar } from "./init";
import { login } from "./login";
import { getRedirectResult, GoogleAuthProvider, type Auth } from "firebase/auth";

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

// @ts-expect-error
var isChromium = !!navigator.userAgentData && navigator.userAgentData.brands.some((data) => data.brand == "Chromium");
if (!isChromium) {
  const message =
    "This site may not work properly on your browser. Please use a Chromium-based browser for the best experience\n\nRecommended Browsers: Google Chrome or Microsoft Edge";
  console.warn(message);
  alert(message);
}

if (!("Proxy" in window)) {
  console.warn("Your browser doesn't support Proxies. Some features may not work properly.");
}

function procs() {
  updateStatus(loadingStatus.LOADING, "Fetching");
  globalThis.mission_id = window.location.pathname.slice(7);
  globalThis.general_unsub = onSnapshot(doc(db, globalThis.mission_id, "procedures"), (doc) => {
    globalThis.mission_name = doc.data()!["name"];
    document.getElementById("mission-name")!.innerText = `::${globalThis.mission_name}`;
    globalThis.step_titles = doc.data()!["section_headers"];
  });

  const q = query(collection(globalThis.db, `${globalThis.mission_id}/procedures/steps`), where("active", "==", true));
  globalThis.steps_unsub = onSnapshot(q, (querySnapshot) => update_procs(querySnapshot));
}

async function main() {
  updateStatus(loadingStatus.LOADING, "Fetching");
  const div = document.getElementById("steps")! as HTMLDivElement;
  const docRef = doc(db, "general", "missions");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
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
    console.log("No such document!");
    alert("Something went wrong - check your internet connection and try again");
    updateStatus(loadingStatus.ERROR);
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
