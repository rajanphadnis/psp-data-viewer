import Coloris from "@melloware/coloris";
import { appVersion, buildDate } from "../generated_app_info";
import { defaultMeasuringToolColors, defaultPlottingColors, measuringToolDefaultColor } from "../theming";

/**
 * Initializes the setting switcher modal
 *
 * This is necessary because otherwise you couldn't add event
 * listeners to the page to open and close the modal. This inits
 * click handlers for all buttons within the settings modal
 *
 * @returns None
 *
 */
export function initSettingsModal() {
  const settings_versionString = document.getElementById("settings_versionString")! as HTMLSpanElement;
  const settings_buildDate = document.getElementById("settings_buildDate")! as HTMLSpanElement;
  const settings_releaseNotesLink = document.getElementById("settings_releaseNotesLink")! as HTMLLinkElement;
  const settingsButton = document.getElementById("settings-button")!;
  const closeButton = document.getElementById("settingsClose")!;
  const textInput = document.getElementById("measuringToolColorPicker")! as HTMLInputElement;
  const measureButton: HTMLButtonElement = document.getElementById("measurePlotButton")! as HTMLButtonElement;
  const measureResetButton: HTMLButtonElement = document.getElementById("reset_measuring_color")! as HTMLButtonElement;

  // If the user requests to reset the measuring tool's point color, reset it to the default color
  measureResetButton.addEventListener("click", (e) => {
    // Update the global app state variable
    globalThis.measuringToolColor = measuringToolDefaultColor;

    // Update the cached value
    try {
      localStorage.setItem("measuringToolPointColor", measuringToolDefaultColor);
    } catch (error) {
      console.error("failed to cache mearing tool color change");
    }

    // Update the value shown to the user
    textInput.value = measuringToolDefaultColor;

    // Update the color picker's displayed color
    textInput.dispatchEvent(new Event("input", { bubbles: true }));
  });

  // If the user right clicks on the measuring button, open the setting modal
  measureButton.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toggleSettingsModal();
  });

  // If the user clicks on the settings button, open the settings modal
  settingsButton.addEventListener("click", (e) => {
    toggleSettingsModal();
  });

  // If the user clicks the "close" button, close the settings modal
  closeButton.addEventListener("click", (e) => {
    toggleSettingsModal();
  });

  // Set the measuring tool point color to the currently selected color
  textInput.value = globalThis.measuringToolColor;

  // When the selected color changes, change it in the cache and global variable
  textInput.addEventListener("change", (e) => {
    globalThis.measuringToolColor = textInput.value;
    try {
      localStorage.setItem("measuringToolPointColor", textInput.value);
    } catch (error) {
      console.error("failed to cache mearing tool color change");
    }
  });

  // Set the app metadata text to the compiled strings
  settings_versionString.innerText = appVersion;
  settings_buildDate.innerText = buildDate;
  settings_releaseNotesLink.href = `https://github.com/rajanphadnis/psp-data-viewer/releases/tag/${appVersion}`;
}

/**
 * Toggle the settings switcher modal open and closed
 *
 * @returns None
 *
 */
export function toggleSettingsModal() {
  const modal = document.getElementById("settingsModal")!;
  const overlayDiv = document.getElementById("plotOverlayDiv")! as HTMLDivElement;

  // If the settings modal is already open, close it
  if (modal.style.display == "block") {
    modal.style.display = "none";
    // overlayDiv.style.display = "flex";
  }

  // otherwise, show the settings modal
  else {
    modal.style.display = "block";

    // hide the measuring tool popup
    document.getElementById("measurementPopup")!.classList.remove("show");

    // re-initialize the color picker plugin
    initColorPlotInputs();

    // hide the plot instructions that is shown when there is nothing on the plot
    overlayDiv.style.display = "none";
  }
}

/**
 * Initializes the color picker plugin
 *
 * Elements affected: `.test-field-text`
 *
 * Swatches: a combination of default measuring tool colors and default pallette colors
 *
 * @returns None
 *
 */
export function initColorPlotInputs() {
  Coloris({
    el: ".test-field-text",
    swatches: [...defaultMeasuringToolColors, ...defaultPlottingColors],
    alpha: false,
    format: "hex",
    themeMode: "dark",
  });
}
