export function initModalEscape() {
  const testModal = document.getElementById("testSwitcherModal")!;
  const settingsModal = document.getElementById("settingsModal")!;
  const measuringModal = document.getElementById("measuringModal")!;
  window.onclick = function (event) {
    if (event.target == testModal) {
      testModal.style.display = "none";
    }
    if (event.target == settingsModal) {
      settingsModal.style.display = "none";
    }
    if (event.target == measuringModal) {
      measuringModal.style.display = "none";
    }
  };
}
