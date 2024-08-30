import Coloris from "@melloware/coloris";
import { appVersion, buildDate } from "../generated_app_info";
import { defaultPlottingColors } from "../theming";

export function initSettingsModal() {
  const modal = document.getElementById("settingsModal")!;
  const settings_versionString = document.getElementById("settings_versionString")! as HTMLSpanElement;
  const settings_buildDate = document.getElementById("settings_buildDate")! as HTMLSpanElement;
  const settings_releaseNotesLink = document.getElementById("settings_releaseNotesLink")! as HTMLLinkElement;
  const settingsButton = document.getElementById("settings-button")!;
  const closeButton = document.getElementById("settingsClose")!;
  settingsButton.addEventListener("click", (e) => {
    toggleSettingsModal();
  });

  closeButton.addEventListener("click", (e) => {
    toggleSettingsModal();
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
    initColorPlotInputs();
  }
}

export function initColorPlotInputs() {
  Coloris({
    el: ".test-field-text",
    swatches: defaultPlottingColors,
    alpha: false,
    format: "hex",
    themeMode: "dark",
  });
}
