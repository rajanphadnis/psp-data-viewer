import { collection, doc, getDoc, onSnapshot, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { enum_to_string, loadingStatus, stepStatus, type ProcedureStep, type SeatingChart } from "./browser/types";
import { updateStatus } from "./dom/status";

export function update_step_instructions(ref_id: string, new_instruction: string) {
  updateStatus(loadingStatus.LOADING, "Writing");
  updateDoc(doc(globalThis.db, globalThis.mission_id, "procedures", "steps", ref_id), {
    instructions: new_instruction,
  })
    .then((result) => {
      console.log("updated instructions");
      updateStatus(loadingStatus.DONE, "Ready");
    })
    .catch((er) => {
      alert("failed to update instruction. Please refresh the page and try again");
      console.error(er);
    });
}

export function update_step_ops(ref_id: string, ops: string) {
  updateStatus(loadingStatus.LOADING, "Writing");
  updateDoc(doc(globalThis.db, globalThis.mission_id, "procedures", "steps", ref_id), {
    operators: ops.split(","),
  })
    .then((result) => {
      console.log("updated ops");
      updateStatus(loadingStatus.DONE, "Ready");
    })
    .catch((er) => {
      alert("failed to update operator(s). Please refresh the page and try again");
      console.log(er);
    });
}

export async function create_step_transaction(to_update: { [index: string]: string }, new_step: ProcedureStep) {
  updateStatus(loadingStatus.LOADING, "Writing");
  // Get a new write batch
  const batch = writeBatch(globalThis.db);
  for (const ref_id in to_update) {
    const update_doc_ref = doc(globalThis.db, globalThis.mission_id, "procedures", "steps", ref_id);
    batch.update(update_doc_ref, { minor_id: to_update[ref_id] });
  }
  const new_step_doc = doc(collection(globalThis.db, globalThis.mission_id, "procedures", "steps"));
  batch.set(new_step_doc, {
    major_id: new_step.major_id,
    minor_id: new_step.minor_id,
    instructions: new_step.instructions,
    status: enum_to_string(new_step.status),
    status_details: new_step.status_details,
    operators: new_step.operators,
    ref_id: new_step_doc.id,
    active: true,
  });

  // Commit the batch
  await batch.commit();
  updateStatus(loadingStatus.DONE, "Ready");
}

export async function delete_step_transaction(to_update: { [index: string]: string }, delete_ref: string) {
  updateStatus(loadingStatus.LOADING, "Writing");
  // Get a new write batch
  const batch = writeBatch(globalThis.db);
  for (const ref_id in to_update) {
    const update_doc_ref = doc(globalThis.db, globalThis.mission_id, "procedures", "steps", ref_id);
    batch.update(update_doc_ref, { minor_id: to_update[ref_id] });
  }
  const new_step_doc = doc(globalThis.db, globalThis.mission_id, "procedures", "steps", delete_ref);
  batch.delete(new_step_doc);

  // Commit the batch
  await batch.commit();
  updateStatus(loadingStatus.DONE, "Ready");
}

export function change_status(ref_id: string, new_status: stepStatus) {
  updateStatus(loadingStatus.LOADING, "Writing");
  updateDoc(doc(globalThis.db, globalThis.mission_id, "procedures", "steps", ref_id), {
    status: enum_to_string(new_status),
  })
    .then((result) => {
      //   console.log("updated status");
      updateStatus(loadingStatus.DONE, "Ready");
    })
    .catch((er) => {
      alert("failed to update status. Please refresh the page and try again");
      console.log(er);
    });
}

export async function get_roles() {
  const docSnap = await getDoc(doc(globalThis.db, globalThis.mission_id, "procedures"));
  if (docSnap.exists()) {
    for (var key in docSnap.data()["roles"]) {
      const names = docSnap.data()["roles"][key] as string[];
      names.forEach((name) => {
        globalThis.roles.push({ operator: key, name: name });
      });
    }
  } else {
    console.log("No such document!");
  }
}

export async function update_seating_chart() {
  await updateDoc(
    doc(globalThis.db, globalThis.mission_id, "seating", "charts", globalThis.currently_selected_seating_chart.ref_id),
    {
      chart: globalThis.currently_displayed_seating_chart,
    }
  );
}
