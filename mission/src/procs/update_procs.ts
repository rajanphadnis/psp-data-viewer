import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { loadingStatus, type ProcedureStep, type stepStatus } from "../browser/types";
import { gen_major_step_content, gen_major_step_header } from "./web_components";
import { updateStatus } from "../dom/status";

export function update_procs(querySnapshot: QuerySnapshot<DocumentData, DocumentData>) {
  const steps: ProcedureStep[] = [];
  querySnapshot.forEach((doc) => {
    const constructed_step: ProcedureStep = {
      major_id: doc.data()["major_id"],
      minor_id: doc.data()["minor_id"],
      instructions: doc.data()["instructions"],
      status: doc.data()["status"] as stepStatus,
      status_details: doc.data()["status_details"],
      operators: doc.data()["operators"],
    };
    steps.push(constructed_step);
  });
  globalThis.steps = steps;
  if (globalThis.mission_name != "") {
    generate_steps();
  }
}

export function generate_steps() {
  const all_steps = globalThis.steps;
  const major_ids = Array.from(new Set(all_steps.map((step) => step.major_id))).sort();
  var steps_div = document.getElementById("steps") as HTMLDivElement;
  steps_div.innerHTML = "";
  major_ids.forEach((major_id) => {
    const steps = all_steps.filter((step) => step.major_id === major_id).sort((a,b) => Number.parseInt(a.minor_id) - Number.parseInt(b.minor_id));
    const header = gen_major_step_header(major_id, globalThis.step_titles[major_id]);
    steps_div.appendChild(header);
    steps_div.appendChild(gen_major_step_content(steps));
    if (globalThis.visible_procs.includes(major_id)) {
        header.click();
      }
  });
  
  updateStatus(loadingStatus.DONE);
}