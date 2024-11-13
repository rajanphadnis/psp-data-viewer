import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { loadingStatus, type ProcedureStep, type stepStatus } from "../browser/types";
import { gen_major_step_content, gen_major_step_header, gen_minor_step } from "./web_components";
import { procs_step_exists, updateStatus } from "../dom/status";

export function update_procs(querySnapshot: QuerySnapshot<DocumentData, DocumentData>) {
  // const steps: ProcedureStep[] = [];
  querySnapshot.docChanges().forEach((change) => {
    const constructed_step: ProcedureStep = {
      major_id: change.doc.data()["major_id"],
      minor_id: change.doc.data()["minor_id"],
      instructions: change.doc.data()["instructions"],
      status: change.doc.data()["status"] as stepStatus,
      status_details: change.doc.data()["status_details"],
      operators: change.doc.data()["operators"],
      is_substep: change.doc.data()["is_substep"] ?? false,
      ref_id: change.doc.id,
    };
    if (change.type === "added") {
      globalThis.steps.push(constructed_step);
      globalThis.procs_update_queue.push(constructed_step.ref_id);
    }
    if (change.type === "modified") {
      const to_modify_index = globalThis.steps.findIndex((val) => val.ref_id == constructed_step.ref_id);
      globalThis.steps[to_modify_index] = constructed_step;
      globalThis.procs_update_queue.push(constructed_step.ref_id);
    }
    if (change.type === "removed") {
      const to_delete_index = globalThis.steps.findIndex((val) => val.ref_id == constructed_step.ref_id);
      globalThis.steps.splice(to_delete_index, 1);
      globalThis.procs_update_queue.push(constructed_step.ref_id);
    }
  });
  // querySnapshot.forEach((doc) => {
  //   const constructed_step: ProcedureStep = {
  //     major_id: doc.data()["major_id"],
  //     minor_id: doc.data()["minor_id"],
  //     instructions: doc.data()["instructions"],
  //     status: doc.data()["status"] as stepStatus,
  //     status_details: doc.data()["status_details"],
  //     operators: doc.data()["operators"],
  //     is_substep: doc.data()["is_substep"] ?? false,
  //     ref_id: doc.id,
  //   };
  //   steps.push(constructed_step);
  // });
  // globalThis.steps = steps;
  if (globalThis.mission_name != "") {
    generate_steps();
  }
}

export function generate_steps(redraw_all: boolean = false) {
  const all_steps = globalThis.steps;
  const major_ids = Array.from(new Set(all_steps.map((step) => step.major_id))).sort();
  const is_all_redraw = all_steps
    .map((val) => globalThis.procs_update_queue.includes(val.ref_id))
    .every((element) => element === true);
  if (redraw_all || is_all_redraw) {
    var steps_div = document.getElementById("steps") as HTMLDivElement;
    steps_div.innerHTML = "";
    major_ids.forEach((major_id) => {
      const steps = all_steps
        .filter((step) => step.major_id === major_id)
        .sort((a, b) => Number.parseInt(a.minor_id) - Number.parseInt(b.minor_id));
      const header = gen_major_step_header(major_id, globalThis.step_titles[major_id]);
      steps_div.appendChild(header);
      steps_div.appendChild(gen_major_step_content(steps));
    });
    globalThis.procs_update_queue = [];
  } else {
    const all_steps_sorted = all_steps.sort((a, b) => {
      if (a.major_id == b.major_id) {
        return Number.parseInt(a.minor_id) - Number.parseInt(b.minor_id); // If major_id is the same, sort by minor_id
      }
      return a.major_id - b.major_id; // Otherwise, sort by major_id
    });
    globalThis.procs_update_queue.forEach((proc_id) => {
      const filtered_step = globalThis.steps.filter((val) => val.ref_id == proc_id);
      const elem = procs_step_exists(proc_id);
      // console.log(filtered_step);
      if (filtered_step.length > 0) {
        const all_steps_filtered = all_steps_sorted.filter((step) => step.major_id === filtered_step[0].major_id);
        const filtered_steps_index = all_steps_filtered.findIndex((val) => val.ref_id == proc_id);
        const proceeding_steps: ProcedureStep[] = globalThis.steps.slice(filtered_steps_index + 1);
        if (elem) {
          // modifying existing step
          // const filtered_steps_index = all_steps_filtered.findIndex((val) => val.ref_id == proc_id);
          // const proceeding_steps: ProcedureStep[] = globalThis.steps.slice(filtered_steps_index + 1);
          const new_elem = gen_minor_step(filtered_step[0], proceeding_steps);
          (elem as HTMLDivElement).replaceWith(new_elem);
        } else {
          // adding new step
          const previous_step: ProcedureStep | null =
            filtered_steps_index == 0 ? null : globalThis.steps[filtered_steps_index - 1];
          console.log(previous_step);
          if (previous_step) {
            console.log();
            const prev_elem = procs_step_exists(previous_step.ref_id) as HTMLDivElement;
            if (previous_step.major_id != filtered_step[0].major_id) {
              // add to top of new step section, if it exists
              console.log(`add to top of section ${filtered_step[0].ref_id}`);
            } else {
              // add under prev_elem
              const new_elem = gen_minor_step(filtered_step[0], proceeding_steps);
              prev_elem.insertAdjacentElement("afterend", new_elem);
            }
          } else {
            // first step. Add to top of section 1, if it exists
            console.log(`add to top of section 1 if it exists`);
          }
        }
      } else {
        // deleting step
        if (elem) {
          (elem as HTMLDivElement).remove();
        } else {
          // do nothing, step is already removed
        }
      }
      globalThis.procs_update_queue.splice(
        globalThis.procs_update_queue.findIndex((val) => val == proc_id),
        1
      );
    });
    globalThis.procs_update_queue = [];
  }

  updateStatus(loadingStatus.DONE);
}

function add_to_section_top(section_num: number, elem: HTMLDivElement) {
  const header = document.getElementById(`section_header_${section_num}`);
  if (header) {
    const first_child = header.children[0];
    first_child.insertAdjacentElement("beforebegin", elem);
  } else {
    
  }
}
