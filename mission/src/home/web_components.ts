export function genDiv(id: string, name: string): HTMLDivElement {
  const div = document.createElement("div");
  const p = document.createElement("p");
  const procs_link = document.createElement("a");
  const seating_link = document.createElement("a");

    div.classList.add("home_mission_entry_div");

  p.innerText = `${name}:`;
  procs_link.innerText = "Procedures";
  procs_link.href = `${location.origin}/procs/${id}`;
  seating_link.innerText = "Roster/Seating Chart";
  seating_link.href = `${location.origin}/seating/${id}`;
  div.appendChild(p);
  div.appendChild(procs_link);
  div.appendChild(seating_link);
  return div;
}
