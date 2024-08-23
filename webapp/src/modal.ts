import type { AllTests } from "./types";

export function initModal() {
  const modal = document.getElementById("testSwitcherModal")!;
  const switchTestButton = document.getElementById("switch-test")!;
  const closeButton = document.getElementsByClassName("close")[0]!;
  switchTestButton.addEventListener("click", (e) => {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", (e) => {
    modal.style.display = "none";
  });
}

export function initModalEscape() {
  const testModal = document.getElementById("testSwitcherModal")!;
  const settingsModal = document.getElementById("settingsModal")!;
  window.onclick = function (event) {
    if (event.target == testModal) {
      testModal.style.display = "none";
    }
    if (event.target == settingsModal) {
      settingsModal.style.display = "none";
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
    const buttonElement = createModalButton(
      test.test_article + ":" + test.gse_article + ":" + test.name,
      test.id,
      isDefault
    );
    modalBody.appendChild(buttonElement);
  }
}

function createModalButton(title: string, id: string, isDefault: boolean) {
  const button = document.createElement("button");
  button.classList.add("modal_button");
  const defaultText: string = "<span class='defaultTestModal'>(default)</span>";
  button.innerHTML = title + (isDefault ? defaultText : "");
  button.addEventListener("click", (e) => {
    document.getElementById("testSwitcherModal")!.style.display = "none";
    if (location.pathname != "/" + id + "/") {
      window.location.href = location.origin + "/" + id + "/";
    }
  });
  return button;
}
