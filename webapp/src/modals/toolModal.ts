import Coloris from "@melloware/coloris";
import { defaultMeasuringToolColors } from "../theming";

export function initToolsModal() {
  const closeButton = document.getElementById("measuringClose")!;
  const textInput = document.getElementById("measuringModalColorPicker")! as HTMLInputElement;
  const measureButton: HTMLButtonElement = document.getElementById("measurePlotButton")! as HTMLButtonElement;
  measureButton.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toggleToolsModal();
  });
  closeButton.addEventListener("click", (e) => {
    toggleToolsModal();

    // modal.style.display = "none";
  });
  textInput.value = globalThis.measuringToolColor;
  textInput.addEventListener("change", (e) => {
    globalThis.measuringToolColor = textInput.value;
    try {
      localStorage.setItem("measuringToolPointColor", textInput.value);
    } catch (error) {
      console.error("failed to cache mearing tool color change");
    }
  });
}

export function toggleToolsModal() {
  const modal = document.getElementById("measuringModal")!;
  if (modal.style.display == "block") {
    modal.style.display = "none";
  } else {
    modal.style.display = "block";
    Coloris({
      el: ".test-field-text",
      swatches: defaultMeasuringToolColors,
      alpha: false,
      format: "hex",
      themeMode: "dark",
    });
  }
}
