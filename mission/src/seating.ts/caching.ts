export function get_default_seating_chart() {
  const fromStorage = localStorage.getItem("seating_chart_currently_displayed");
  if (fromStorage == null) {
    return globalThis.seating_chart[0];
  }
  return globalThis.seating_chart.filter((val) => val.ref_id == fromStorage)[0] ?? globalThis.seating_chart[0];
}

export function set_default_seating_chart(ref_id: string) {
  localStorage.setItem("seating_chart_currently_displayed", ref_id);
}
