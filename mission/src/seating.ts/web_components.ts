import type { RoleAssignments, SeatingChart } from "../browser/types";
import { update_seating_chart } from "../db_interaction";
import { set_default_seating_chart } from "./caching";
import { draw_chart } from "./seating_chart";

export function gen_dropdown() {
  const main_div = document.createElement("div");
  const button = document.createElement("button");
  const list_div = document.createElement("div");
  globalThis.seating_chart.forEach((chart) => {
    list_div.appendChild(gen_link(chart));
  });
  main_div.classList.add("seating_chart_dropdown");
  button.classList.add("dropbtn");
  list_div.classList.add("seating_chart_dropdown-content");
  list_div.id = "dropdown_list_div";
  button.addEventListener("click", () => {
    list_div.classList.toggle("show_seating_chart_dropdown");
  });
  button.innerText = "Select Room Layout";
  main_div.appendChild(button);
  main_div.appendChild(list_div);
  return main_div;
}

function gen_link(entry: SeatingChart) {
  const a = document.createElement("a");
  a.href = `#${entry.ref_id}`;
  a.innerText = entry.room_name;
  a.addEventListener("click", (e) => {
    globalThis.currently_selected_seating_chart = entry;
    set_default_seating_chart(globalThis.currently_selected_seating_chart.ref_id);
    document.getElementById("dropdown_list_div")!.classList.toggle("show_seating_chart_dropdown");
    draw_chart();
  });
  return a;
}

export function gen_trash() {
  const main_div = document.createElement("div");
  const span = document.createElement("span");
  const secondary_div = document.createElement("div");
  main_div.classList.add("trash");
  span.innerHTML = "Remove from control room";
  secondary_div.appendChild(span);
  main_div.appendChild(secondary_div);
  return main_div;
}

export function gen_draggable(role: RoleAssignments) {
  const main_div = document.createElement("div");
  const span = document.createElement("span");
  const secondary_div = document.createElement("div");
  const third_div = document.createElement("div");
  main_div.classList.add("newWidget");
  main_div.classList.add("grid-stack-item");
  main_div.setAttribute("gs-w", "2");
  main_div.setAttribute("gs-h", "2");
  secondary_div.classList.add("grid-stack-item-content");
  secondary_div.style.padding = "5px";
  if (role.operator == role.name && role.name == "") {
    span.innerHTML = "None";
  } else {
    span.innerHTML = `${role.operator}<br><br>${role.name}`;
  }
  secondary_div.appendChild(span);
  // third_div.appendChild(span);
  main_div.appendChild(secondary_div);
  return main_div;
}

export function gen_loaded_draggable(content: string) {
  // console.log(content);
  const main_div = document.createElement("div");
  const first_div = document.createElement("div");
  const second_div = document.createElement("div");
  const span = document.createElement("span");
  first_div.innerHTML = content;
  // first_div.appendChild(span);

  if (content.includes("<br>") || content.includes("None")) {
    first_div.classList.add("grid-stack-person");
  }
  else {
    first_div.classList.add("grid-stack-fixed");
  }

  main_div.classList.add("grid-stack-item");
  main_div.setAttribute("gs-w", "2");
  main_div.setAttribute("gs-h", "2");
  // main_div.style.width = "auto";
  first_div.classList.add("grid-stack-item-content");
  second_div.classList.add("ui-resizable-handle");
  second_div.classList.add("ui-resizable-se");
  second_div.setAttribute("style", "z-index: 100; user-select: none;");

  main_div.appendChild(first_div);
  main_div.appendChild(second_div);
  return main_div;
}

export function gen_seating_chart_title() {
  const header = document.createElement("h1");
  header.textContent = globalThis.currently_selected_seating_chart.room_name;
  return header;
}

export function gen_save_button() {
  const button = document.createElement("button");
  button.id = "save_button";
  button.addEventListener("click", () => {
    update_seating_chart();
  });
  button.innerText = "Save Layout";
  return button;
}

export function gen_roster_entry(role: RoleAssignments) {
  const div = document.createElement("div");
  const p = document.createElement("p");
  const input = document.createElement("input");
  div.classList.add("roster_entry_div");
  input.id = `roster_entry_${role.operator}`;
  input.value = role.name;
  input.classList.add("roster_entry_input");
  p.innerHTML = `${role.operator}: `;
  div.appendChild(p);
  div.appendChild(input);
  return div;
}
