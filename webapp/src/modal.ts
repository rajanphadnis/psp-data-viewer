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

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

export function setKnownTests(test: AllTests, default_url: String): void {
  const modalBody = document.getElementById("modal-body")!;
  for (let [id, title] of Object.entries(test)) {
    let isDefault: boolean = false;
    if (id == default_url) {
      isDefault = true;
    }
    const buttonElement = createModalButton(title, id, isDefault);
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
    if (!isDefault) {
      window.location.href = location.origin + "/" + id + "/";
    }
  });
  return button;
}
