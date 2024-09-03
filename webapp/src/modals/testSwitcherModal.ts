import type { AllTests } from "../types";

export function initSwitcherModal() {
  const switchTestButton = document.getElementById("switch-test")!;
  const closeButton = document.getElementsByClassName("close")[0]!;
  switchTestButton.addEventListener("click", (e) => {
    toggleSwitcherModal()
  });

  closeButton.addEventListener("click", (e) => {
    toggleSwitcherModal()
  });
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


export function toggleSwitcherModal() {
  const modal = document.getElementById("testSwitcherModal")!;
  if (modal.style.display == "block") {
    modal.style.display = "none";
  } else {
    document.getElementById("measurementPopup")!.classList.remove("show");
    modal.style.display = "block";
  }
}