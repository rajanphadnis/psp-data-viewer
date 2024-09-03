import Coloris from "@melloware/coloris";
import { appVersion, buildDate } from "../generated_app_info";
import { defaultMeasuringToolColors, defaultPlottingColors, measuringToolDefaultColor } from "../theming";

export function initSettingsModal() {
  const settings_versionString = document.getElementById("settings_versionString")! as HTMLSpanElement;
  const settings_buildDate = document.getElementById("settings_buildDate")! as HTMLSpanElement;
  const settings_releaseNotesLink = document.getElementById("settings_releaseNotesLink")! as HTMLLinkElement;
  const settingsButton = document.getElementById("settings-button")!;
  const closeButton = document.getElementById("settingsClose")!;
  const textInput = document.getElementById("measuringToolColorPicker")! as HTMLInputElement;
  const measureButton: HTMLButtonElement = document.getElementById("measurePlotButton")! as HTMLButtonElement;
  const measureResetButton: HTMLButtonElement = document.getElementById("reset_measuring_color")! as HTMLButtonElement;
  measureResetButton.addEventListener("click", (e) => {
    globalThis.measuringToolColor = measuringToolDefaultColor;
    try {
      localStorage.setItem("measuringToolPointColor", measuringToolDefaultColor);
    } catch (error) {
      console.error("failed to cache mearing tool color change");
    }
    textInput.value = measuringToolDefaultColor;
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
  });
  measureButton.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toggleSettingsModal();
  });
  settingsButton.addEventListener("click", (e) => {
    toggleSettingsModal();
  });

  closeButton.addEventListener("click", (e) => {
    toggleSettingsModal();
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
  settings_versionString.innerText = appVersion;
  settings_buildDate.innerText = buildDate;
  settings_releaseNotesLink.href = `https://github.com/rajanphadnis/psp-data-viewer/releases/tag/${appVersion}`;
}

export function toggleSettingsModal() {
  const modal = document.getElementById("settingsModal")!;
  if (modal.style.display == "block") {
    modal.style.display = "none";
  } else {
    modal.style.display = "block";
    document.getElementById("measurementPopup")!.classList.remove("show");
    initColorPlotInputs();
  }
}

export function initColorPlotInputs() {
  Coloris({
    el: ".test-field-text",
    swatches: [...defaultMeasuringToolColors, ...defaultPlottingColors],
    alpha: false,
    format: "hex",
    themeMode: "dark",
  });
  // Coloris({
  //   el: ".test-field-text-2",
  //   swatches: defaultMeasuringToolColors,
  //   alpha: false,
  //   format: "hex",
  //   themeMode: "dark",
  // });
}
