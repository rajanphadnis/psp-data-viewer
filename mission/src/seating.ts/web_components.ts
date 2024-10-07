import type { SeatingChart } from "../browser/types";
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

export function gen_draggable() {
  const main_div = document.createElement("div");
  const span = document.createElement("span");
  const secondary_div = document.createElement("div");
  const third_div = document.createElement("div");
  main_div.classList.add("newWidget");
  main_div.classList.add("grid-stack-item");
  secondary_div.classList.add("grid-stack-item-content");
  secondary_div.style.padding = "5px";
  span.innerHTML = "TOP: Person Name";
  secondary_div.appendChild(third_div);
  third_div.appendChild(span);
  main_div.appendChild(secondary_div);
  return main_div;
}

export function gen_seating_chart_title() {
    const header = document.createElement("h1");
    header.textContent = globalThis.currently_selected_seating_chart.room_name;
    return header;
}
