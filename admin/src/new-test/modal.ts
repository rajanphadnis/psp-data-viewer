export function initConfirmationModal() {
    const modal = document.getElementById("testSwitcherModal")!;
    const finalizeButton = document.getElementById("finalizeButton")!;
    const closeButton = document.getElementsByClassName("close")[0]!;
    // finalizeButton.addEventListener("click", (e) => {
    //   modal.style.display = "block";
    // });
  
    closeButton.addEventListener("click", (e) => {
      modal.style.display = "none";
    });
  
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }