import { getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { toggleEditingStatus, updateLockouts } from "../procs/auth_and_editing_locks";
import { search_icon } from "../browser/icons";
import { generate_steps } from "../procs/update_procs";

export function initGlobalVars() {
  const range = (start: number, end: number) => Array.from({length: (end - start)}, (v, k) => k + start);
  globalThis.visible_procs = range(1,31);
  globalThis.mission_name = "Loading...";
  globalThis.steps = [];
  globalThis.is_authenticated = false;
  globalThis.is_editing_mode = false;
  globalThis.role_search = "";
  globalThis.seating_chart = [];
  globalThis.roles = [{operator: "", name: ""}];
  globalThis.currently_displayed_seating_chart = "";
}

export async function initNavbar() {
  document.getElementById("editing-lock")!.addEventListener("click", () => {
    toggleEditingStatus();
  });
  document.getElementById("role-search")!.innerHTML = search_icon;
  document.getElementById("role-search")!.addEventListener("click", () => {
    globalThis.role_search = prompt("What is your role?") ?? "";
    if (location.pathname.includes("/procs/")) {
      generate_steps();
    }
  });
  document.getElementById("title")!.addEventListener("click", () => {
    window.location.pathname = "";
  });
  // await
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(user);
      globalThis.is_authenticated = true;
      updateLockouts();
      // ...
    } else {
      globalThis.is_authenticated = false;
      // User is signed out
      // ...
      updateLockouts();
    }
  });
}

export function initModal() {
  const modal = document.getElementById("confirmationModal")! as HTMLDivElement;

  const closeButton = document.getElementsByClassName("close")[0]!;
  closeButton.addEventListener("click", (e) => {
    console.log("close");
    modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == modal) {
      console.log("quit");
      modal.style.display = "none";
    }
  };
}
