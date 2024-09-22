import type { AllTests } from "../types";

/**
 * Initializes the test switcher modal
 *
 * This is necessary because otherwise you couldn't add event
 * listeners to the page to open and close the modal
 *
 * @returns None
 *
 */
export function initSwitcherModal() {
  const switchTestButton = document.getElementById("switch-test")!;
  const closeButton = document.getElementsByClassName("close")[0]!;

  // If the test switcher button is clicked, open the modal
  switchTestButton.addEventListener("click", (e) => {
    toggleSwitcherModal();
  });

  // If the "close" button is clicked, close the modal
  closeButton.addEventListener("click", (e) => {
    toggleSwitcherModal();
  });
}

export function setKnownTests(tests: AllTests[], default_url: String): void {
  const modalBody = document.getElementById("modal-body")!;
  tests.sort(function (a, b) {
    if (a.test_article === b.test_article) {
      if (a.gse_article === b.gse_article) {
        return b.name < a.name ? 1 : -1;
      } else if (a.gse_article < b.gse_article) {
        return 1;
      } else if (a.gse_article < b.gse_article) {
        return -1;
      }
    } else if (a.test_article < b.test_article) {
      return 1;
    } else if (a.test_article < b.test_article) {
      return -1;
    }
    return -1;
  });
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

/**
 * Toggle the test switcher modal open and closed
 *
 * @returns None
 *
 */
export function toggleSwitcherModal() {
  const modal = document.getElementById("testSwitcherModal")!;
  const overlayDiv = document.getElementById("plotOverlayDiv")! as HTMLDivElement;

  // If the modal is open, close it
  if (modal.style.display == "block") {
    modal.style.display = "none";
    // overlayDiv.style.display = "flex";
  }

  // If the modal is closed, open it
  else {
    // Hide the measurement popup when we open the modal
    document.getElementById("measurementPopup")!.classList.remove("show");

    // open the modal
    modal.style.display = "block";

    // Hide the plot instructions that is shown when there is nothing on the plot
    overlayDiv.style.display = "none";
  }
}
