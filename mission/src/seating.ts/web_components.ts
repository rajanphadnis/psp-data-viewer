import type { RoleAssignments, SeatingChart } from "../browser/types";
import { update_seating_chart } from "../db_interaction";
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
    span.innerHTML = `${role.operator}: ${role.name}`;
  }
  secondary_div.appendChild(third_div);
  third_div.appendChild(span);
  main_div.appendChild(secondary_div);
  return main_div;
}

export function gen_temp_draggable(unsplit: string) {
  const main_div = document.createElement("div");
  const first_div = document.createElement("div");
  const second_div = document.createElement("div");
  const span = document.createElement("span");
  if (unsplit == "None") {
    span.innerHTML = "Empty";
  } else {
    span.innerHTML = `${unsplit.split(": ")[0]}</br></br>${unsplit.split(": ")[1]}`;
  }
  first_div.appendChild(span);

  main_div.classList.add("grid-stack-item");
  main_div.setAttribute("gs-w", "2");
  main_div.setAttribute("gs-h", "2");
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
