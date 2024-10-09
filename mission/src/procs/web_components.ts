import { delete_icon, delete_icon_dark } from "../browser/icons";
import { enum_to_string, stepStatus, type ProcedureStep } from "../browser/types";
import {
  change_status,
  create_step_transaction,
  delete_step_transaction,
  update_step_instructions,
  update_step_ops,
} from "../db_interaction";
import { bump_minor_id } from "./parsing";

export const loader: string = '<div class="loader"></div>';

export function gen_major_step_header(major_step: number, name: string): HTMLButtonElement {
  const button: HTMLButtonElement = document.createElement("button");
  const p: HTMLParagraphElement = document.createElement("p");
  const span: HTMLSpanElement = document.createElement("span");
  const editing_div: HTMLDivElement = document.createElement("div");
  span.innerHTML = delete_icon;
  span.classList.add("major_step_header_delete_span");

  p.classList.add("major_step_header_p");
  editing_div.classList.add("major_step_editing_div");
  button.addEventListener("click", function (ev) {
    if (ev.target == button || ev.target == p) {
      button.classList.toggle("expanded_major_step");
      var content = button.nextElementSibling! as HTMLDivElement;
      if (content.style.maxHeight) {
        content.style.removeProperty("max-height");
        globalThis.visible_procs = globalThis.visible_procs.filter((item) => item !== major_step);
      } else {
        if (globalThis.is_editing_mode) {
          content.style.maxHeight = (content.scrollHeight + 75) + "px";
        }
        else {
          content.style.maxHeight = content.scrollHeight + "px";

        }
        globalThis.visible_procs.push(major_step);
        globalThis.visible_procs = Array.from(new Set(globalThis.visible_procs));
      }
    }
  });
  button.classList.add("major_step_header");
  button.type = "button";

  p.innerText = `${major_step} - ${name}`;
  button.appendChild(p);
  if (globalThis.is_editing_mode) {
    // p.innerText = ' - ';
    // editing_div.appendChild(gen_text_input(major_step.toString()));
    // editing_div.appendChild(p);
    // editing_div.appendChild(gen_text_input(name));
    // button.appendChild(editing_div);
    button.appendChild(span);
    span.addEventListener("click", () => {
      document.getElementById("modal-content-span")!.innerHTML = major_step.toString();
      document.getElementById("confirmationModal")!.style.display = "block";
      console.log("delete major step: " + major_step.toString());
    });
  }

  return button;
}

export function gen_major_step_content(steps: ProcedureStep[]): HTMLDivElement {
  const main_div: HTMLDivElement = document.createElement("div");
  main_div.classList.add("major_step_content");
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (globalThis.is_editing_mode) {
      main_div.appendChild(gen_add_minor_step_button(steps.slice(i), steps[0].major_id, step.minor_id));
    }
    main_div.appendChild(gen_minor_step(step, steps.slice(i)));
  }

  if (globalThis.is_editing_mode) {
    main_div.appendChild(
      gen_add_minor_step_button([], steps[0].major_id, bump_minor_id(steps[steps.length - 1].minor_id))
    );
  }
  return main_div;
}

function gen_minor_step(step: ProcedureStep, proceeding_steps: ProcedureStep[]): HTMLDivElement {
  const main: HTMLDivElement = document.createElement("div");
  const left: HTMLDivElement = document.createElement("div");
  const right: HTMLDivElement = document.createElement("div");
  const number_p: HTMLParagraphElement = document.createElement("p");
  const op_p: HTMLParagraphElement = document.createElement("p");
  const op_span: HTMLSpanElement = document.createElement("span");
  const instructions_p: HTMLParagraphElement = document.createElement("p");

  const delete_span: HTMLSpanElement = document.createElement("span");

  delete_span.innerHTML = delete_icon_dark;
  delete_span.classList.add("step_delete_span");

  main.classList.add("minor_step_main");
  if (step.status.toString() == "COMPLETED") {
    main.classList.add("completed_step");
  }
  if (step.status.toString() == "WIP") {
    main.classList.add("minor_step_wip");
  }
  left.classList.add("minor_step_ops_and_instructions");
  right.classList.add("minor_step_complete");
  number_p.classList.add("minor_step_number");
  op_span.classList.add("minor_step_ops");
  if (step.operators.includes(globalThis.role_search)) {
    op_span.classList.add("minor_step_ops_highlighted");
  }
  instructions_p.classList.add("minor_step_instructions");

  number_p.innerText = `${step.major_id}.${step.minor_id}`;
  op_p.innerText = step.operators.join(", ");
  instructions_p.innerText = step.instructions;

  op_span.appendChild(globalThis.is_editing_mode ? gen_minor_ops_input(step) : op_p);
  left.appendChild(number_p);
  left.appendChild(op_span);
  left.appendChild(globalThis.is_editing_mode ? gen_minor_instructions_input(step) : instructions_p);
  right.appendChild(status_toggle(step.status, step.ref_id));
  if (globalThis.is_editing_mode) {
    right.appendChild(delete_span);
    delete_span.addEventListener("click", async () => {
      let to_update: { [index: string]: string } = {};
      if (proceeding_steps.length > 0) {
        proceeding_steps.forEach((step) => {
          const new_minor_id = bump_minor_id(step.minor_id, true);
          to_update[step.ref_id] = new_minor_id;
          // console.log(`${proceeding_steps[0].minor_id} --> ${new_minor_id}`);
        });
      }
      await delete_step_transaction(to_update, step.ref_id);
    });
  }
  main.appendChild(left);
  main.appendChild(right);

  main.id = step.ref_id;

  return main;
}

function gen_minor_ops_input(step: ProcedureStep) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = step.operators.join(",");
  input.classList.add("procs_input_text");
  input.classList.add("procs_input_text_ops");
  input.addEventListener("change", async (e) => {
    console.log((e.target! as HTMLInputElement).value);
    await update_step_ops(step.ref_id, (e.target! as HTMLInputElement).value);
  });
  return input;
}

function gen_minor_instructions_input(step: ProcedureStep) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = step.instructions;
  input.classList.add("procs_input_text");
  input.classList.add("procs_input_text_instructions");
  input.addEventListener("change", async (e) => {
    console.log((e.target! as HTMLInputElement).value);
    await update_step_instructions(step.ref_id, (e.target! as HTMLInputElement).value);
  });
  return input;
}

function gen_add_minor_step_button(proceeding_steps: ProcedureStep[], major_id: number, create_minor_id: string) {
  const button = document.createElement("button");
  button.classList.add("add_step_button");
  button.innerText = "Insert Step";
  button.addEventListener("click", async (e) => {
    const new_step: ProcedureStep = {
      major_id: major_id,
      minor_id: create_minor_id,
      instructions: "",
      status: stepStatus.WRITTEN,
      status_details: "",
      operators: ["TC"],
      ref_id: "",
    };
    let to_update: { [index: string]: string } = {};
    if (proceeding_steps.length > 0) {
      proceeding_steps.forEach((step) => {
        const new_minor_id = bump_minor_id(step.minor_id);
        to_update[step.ref_id] = new_minor_id;
        // console.log(`${proceeding_steps[0].minor_id} --> ${new_minor_id}`);
      });
    }
    await create_step_transaction(to_update, new_step);
  });
  return button;
}

function status_toggle(status: stepStatus, ref: string) {
  const button = document.createElement("button") as HTMLButtonElement;
  button.classList.add("minor_step_status");
  switch (status.toString()) {
    case enum_to_string(stepStatus.COMPLETED):
      button.classList.add("minor_step_status_complete");
      break;
    case enum_to_string(stepStatus.WIP):
      button.classList.add("minor_step_status_wip");
      break;
    default:
      button.classList.add("minor_step_status_written");
      break;
  }
  button.innerText = status.toString();
  if (globalThis.is_authenticated) {
    button.addEventListener("click", (e) => {
      if (status.toString() == enum_to_string(stepStatus.COMPLETED)) {
        change_status(ref, stepStatus.WRITTEN);
      } else if (status.toString() == enum_to_string(stepStatus.WIP)) {
        change_status(ref, stepStatus.WRITTEN);
      } else {
        change_status(ref, stepStatus.COMPLETED);
      }
    });
    button.addEventListener("contextmenu", (e) => {
      console.log("right click");
      e.preventDefault();
      if (status.toString() != enum_to_string(stepStatus.WIP)) {
        change_status(ref, stepStatus.WIP);
      }
    });
  }

  return button;
}
