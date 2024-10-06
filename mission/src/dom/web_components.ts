import { loadingStatus, stepStatus, type ProcedureStep } from "../browser/types";

export const loader: string = '<div class="loader"></div>';



export function gen_major_step_header(major_step: number, name: string): HTMLButtonElement {
  const button: HTMLButtonElement = document.createElement("button");
  const p: HTMLParagraphElement = document.createElement("p");
  p.innerText = `${major_step} - ${name}`;
  p.classList.add("major_step_header_p");
  button.addEventListener("click", function () {
    button.classList.toggle("expanded_major_step");
    var content = button.nextElementSibling! as HTMLDivElement;
    if (content.style.maxHeight) {
      content.style.removeProperty("max-height");
      globalThis.visible_procs = globalThis.visible_procs.filter((item) => item !== major_step);
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      globalThis.visible_procs.push(major_step);
    }
  });
  button.classList.add("major_step_header");
  button.type = "button";
  button.appendChild(p);
  return button;
}

export function gen_major_step_content(steps: ProcedureStep[]): HTMLDivElement {
  const main_div: HTMLDivElement = document.createElement("div");
  main_div.classList.add("major_step_content");
  steps.forEach((step) => {
    main_div.appendChild(gen_minor_step(step));
  });
  return main_div;
}

function gen_minor_step(step: ProcedureStep): HTMLDivElement {
  const main: HTMLDivElement = document.createElement("div");
  const left: HTMLDivElement = document.createElement("div");
  const right: HTMLDivElement = document.createElement("div");
  const number_p: HTMLParagraphElement = document.createElement("p");
  const op_p: HTMLParagraphElement = document.createElement("p");
  const op_span: HTMLSpanElement = document.createElement("span");
  const instructions_p: HTMLParagraphElement = document.createElement("p");
  const status_p: HTMLParagraphElement = document.createElement("p");

  main.classList.add("minor_step_main");
  if (step.status.toString() == "COMPLETED") {
    main.classList.add("completed_step");
  }
  left.classList.add("minor_step_ops_and_instructions");
  right.classList.add("minor_step_complete");
  number_p.classList.add("minor_step_number");
  op_span.classList.add("minor_step_ops");
  instructions_p.classList.add("minor_step_instructions");
  status_p.classList.add("minor_step_status");

  number_p.innerText = `${step.major_id}.${step.minor_id}`;
  op_p.innerText = step.operators.join("\n");
  instructions_p.innerText = step.instructions;
  status_p.innerText = step.status.toString();

  op_span.appendChild(op_p);
  left.appendChild(number_p);
  left.appendChild(op_span);
  left.appendChild(instructions_p);
  right.appendChild(status_p);
  main.appendChild(left);
  main.appendChild(right);

  return main;
}
