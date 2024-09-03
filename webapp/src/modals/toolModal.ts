import { initCalcChannelList, redrawCalcChannelsList } from "../calcs_engine/element_backend";

export function initToolsModal() {
  const closeButton = document.getElementById("toolClose")!;
  closeButton.addEventListener("click", (e) => {
    toggleToolsModal();
  });
  initCalcChannelList();
}

export function toggleToolsModal() {
  const modal = document.getElementById("measuringModal")!;
  if (modal.style.display == "block") {
    modal.style.display = "none";
  } else {
    redrawCalcChannelsList();
    document.getElementById("measurementPopup")!.classList.remove("show");
    modal.style.display = "block";
  }
}
