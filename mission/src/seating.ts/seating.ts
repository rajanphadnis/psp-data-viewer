import { loadingStatus } from "../browser/types";
import { updateStatus } from "../dom/status";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { update_chart } from "./seating_chart";
import { get_roles } from "../db_interaction";

export function seating() {
  updateStatus(loadingStatus.LOADING, "Fetching");
  globalThis.mission_id = window.location.pathname.slice(9);
  get_roles();
  const q = query(collection(globalThis.db, `${globalThis.mission_id}/seating/charts`), where("active", "==", true));
  globalThis.seating_unsub = onSnapshot(q, (querySnapshot) => update_chart(querySnapshot));
}