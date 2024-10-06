import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import type { ProcedureStep, stepStatus } from "./types";
import { generate_steps } from "./web_components";

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
  console.log(steps);
  globalThis.steps = steps;
  if (globalThis.mission_name != "") {
    generate_steps();
  }
  //   globalThis.unsub();
}
