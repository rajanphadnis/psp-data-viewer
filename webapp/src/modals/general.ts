export function initModalEscape() {
  const testModal = document.getElementById("testSwitcherModal")!;
  const settingsModal = document.getElementById("settingsModal")!;
  const measuringModal = document.getElementById("measuringModal")!;
  window.onclick = function (event) {
    const overlayDiv = document.getElementById("plotOverlayDiv")! as HTMLDivElement;
    if (event.target == testModal) {
      testModal.style.display = "none";
      // overlayDiv.style.display = "flex";
    }
    if (event.target == settingsModal) {
      settingsModal.style.display = "none";
      // overlayDiv.style.display = "flex";
    }
    if (event.target == measuringModal) {
      measuringModal.style.display = "none";
      // overlayDiv.style.display = "flex";
    }
  };
}
