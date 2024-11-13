import { getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";
import { toggleEditingStatus, updateLockouts } from "../procs/auth_and_editing_locks";
import { people_icon, search_icon } from "../browser/icons";
import { generate_steps } from "../procs/update_procs";
import { init_roster_modal } from "../seating.ts/roster";

export function initGlobalVars() {
  const range = (start: number, end: number) => Array.from({ length: end - start }, (v, k) => k + start);
  globalThis.visible_procs = range(1, 31);
  globalThis.mission_name = "Loading...";
  globalThis.steps = [];
  globalThis.is_authenticated = false;
  globalThis.is_editing_mode = false;
  globalThis.role_search = "";
  globalThis.seating_chart = [];
  globalThis.roles = [{ operator: "", name: "" }];
  globalThis.roster = [];
  globalThis.currently_displayed_seating_chart = "";
  globalThis.procs_update_queue = [];
}

export async function initNavbar() {
  document.getElementById("editing-lock")!.addEventListener("click", () => {
    toggleEditingStatus();
  });
  if (location.pathname.includes("/procs/")) {
    document.getElementById("role-search")!.innerHTML = search_icon;
  }
  if (location.pathname.includes("/seating/")) {
    document.getElementById("role-search")!.innerHTML = people_icon;
  }
  document.getElementById("role-search")!.addEventListener("click", () => {
    if (location.pathname.includes("/procs/")) {
      globalThis.role_search = prompt("What is your role?") ?? "";
      generate_steps(true);
    }
    if (location.pathname.includes("/seating/")) {
      document.getElementById("roster_modal")!.style.display = "block";
      init_roster_modal();
      // const sets = prompt("Seating thing") ?? "";
      // console.log(sets);
      // generate_steps();
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

export function initConfirmationModal() {
  const confirmation_modal = document.getElementById("confirmationModal")! as HTMLDivElement;
  const roster_modal = document.getElementById("roster_modal")! as HTMLDivElement;

  const closeButton = document.getElementsByClassName("close")[0]!;
  closeButton.addEventListener("click", (e) => {
    console.log("close");
    confirmation_modal.style.display = "none";
  });

  window.onclick = function (event) {
    if (event.target == confirmation_modal) {
      console.log("quit");
      confirmation_modal.style.display = "none";
    }
    if (event.target == roster_modal) {
      console.log("quit");
      roster_modal.style.display = "none";
    }
  };
}

export function initRosterModal() {
  const roster_modal = document.getElementById("roster_modal")! as HTMLDivElement;

  const closeButton = document.getElementsByClassName("close")[1]!;
  closeButton.addEventListener("click", (e) => {
    console.log("close");
    roster_modal.style.display = "none";
  });
}
