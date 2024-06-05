import type { AllTests } from "./types";

export function initModals() {
  const testSwitcherModal = document.getElementById("testSwitcherModal")!;
  const legendColorModal = document.getElementById("legendColorModal")!;
  const switchTestButton = document.getElementById("switch-test")!;
  const closeSwitcherButton = document.getElementById("closeSwitcherModal")!
  const closeColorModal = document.getElementById("closeColorModal")!;
  const setPlotColorsButton: HTMLButtonElement = document.getElementById("setPlotColorsButton")! as HTMLButtonElement;
  switchTestButton.addEventListener("click", (e) => {
    testSwitcherModal.style.display = "block";
  });

  setPlotColorsButton.addEventListener("click", (e) => {
    legendColorModal.style.display = "block";
  });

  closeSwitcherButton.addEventListener("click", (e) => {
    testSwitcherModal.style.display = "none";
  });

  closeColorModal.addEventListener("click", (e) => {
    legendColorModal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == testSwitcherModal) {
      testSwitcherModal.style.display = "none";
    }
    if (event.target == legendColorModal) {
      legendColorModal.style.display = "none";
    }
  };
}

export function setKnownTests(tests: AllTests[], default_url: String): void {
  const modalBody = document.getElementById("modal-body")!;
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    let isDefault: boolean = false;
    if (test.id == default_url) {
      isDefault = true;
    }
    const buttonElement = createModalButton(test.test_article + ":" + test.gse_article + ":" + test.name, test.id, isDefault);
    modalBody.appendChild(buttonElement);
  }
}

function createModalButton(title: string, id: string, isDefault: boolean) {
  const button = document.createElement("button");
  button.classList.add("modal_button");
  const defaultText: string = "<span class='defaultTestModal'> (default)</span>";
  button.innerHTML = title + (isDefault ? defaultText : "");
  button.addEventListener("click", (e) => {
    document.getElementById("testSwitcherModal")!.style.display = "none";
    if (location.pathname != "/" + id + "/") {
      window.location.href = location.origin + "/" + id + "/";
    }
  });
  return button;
}
