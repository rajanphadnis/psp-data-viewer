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
  const overlayDiv = document.getElementById("plotOverlayDiv")! as HTMLDivElement;
  const channelWindowSpan = document.getElementById("calc_channel_window_size_span")! as HTMLSpanElement;
  if (modal.style.display == "block") {
    modal.style.display = "none";
    // overlayDiv.style.display = "flex";
  } else {
    redrawCalcChannelsList();
    document.getElementById("measurementPopup")!.classList.remove("show");
    modal.style.display = "block";
    channelWindowSpan.innerHTML = `${globalThis.calcChannelWindow} (${globalThis.calcChannelDt_seconds.toFixed(6)} seconds)`;
    // overlayDiv.style.display = "none";
  }
}
