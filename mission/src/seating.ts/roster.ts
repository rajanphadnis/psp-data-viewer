import type { Roster } from "../browser/types";
import { get_all_operators, set_roster } from "../db_interaction";
import { loader } from "../procs/web_components";
import { seating } from "./seating";
import { gen_roster_entry } from "./web_components";

export async function init_roster_modal() {
  const body = document.getElementById("roster-modal-body")! as HTMLDivElement;
  const p = document.createElement("p");
  p.innerHTML = `The following operator roles were found in this mission's procedure (<a href="/procs/${globalThis.mission_id}">Open Procedures</a>). To add or remove operator roles, update the procedures.`;
  body.innerHTML = loader;
  const operators = await get_all_operators();
  body.innerHTML = "";
  body.appendChild(p);
  operators.sort();
  operators.forEach((operator) => {
    const searchIndex = globalThis.roster.findIndex((role) => role.operator == operator);
    const name = searchIndex == -1 ? "" : globalThis.roster[searchIndex].names.join(", ");
    body.appendChild(gen_roster_entry({ operator, name }));
  });
  globalThis.roster.sort((a, b) => (a.operator < b.operator ? 1 : -1));
  document.getElementById("roster_save")?.addEventListener("click", (e) => {
    save_roster();
  });
}

export async function save_roster() {
  const all_elements = document.getElementsByClassName("roster_entry_input");
  let roster_entries: Roster[] = [];
  for (let i = 0; i < all_elements.length; i++) {
    const element = all_elements[i] as HTMLInputElement;
    const op = element.id.slice(13);
    const names = element.value;
    const roster_entry: Roster = { operator: op, names: names.split(", ") ?? [""] };
    roster_entries.push(roster_entry);
  }
  await set_roster(roster_entries);
  const roster_modal = document.getElementById("roster_modal")! as HTMLDivElement;
  roster_modal.style.display = "none";
  //   seating();
  window.location.reload();
}
