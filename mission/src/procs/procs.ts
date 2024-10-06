import { onSnapshot, doc, query, collection, where } from "firebase/firestore";
import { loadingStatus } from "../browser/types";
import { updateStatus } from "../dom/status";
import { update_procs } from "./update_procs";


export function procs() {
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
