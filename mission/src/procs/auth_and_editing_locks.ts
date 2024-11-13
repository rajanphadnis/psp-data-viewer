import { GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { locked_icon, unlocked_icon } from "../browser/icons";
import { generate_steps } from "./update_procs";
import { draw_chart } from "../seating.ts/seating_chart";

export function updateLockouts() {
  const is_auth = globalThis.is_authenticated;
  const is_edit = globalThis.is_editing_mode;
  if (is_auth) {
    document.getElementById("loginButton")!.addEventListener("click", () => {
      signOut(globalThis.auth)
        .then(() => {
          // Sign-out successful.
          window.location.pathname = window.location.pathname;
        })
        .catch((error) => {
          // An error happened.
        });
    });
    document.getElementById("loginButton")!.innerText = "Logout";
    if (is_edit) {
      document.getElementById("editing-lock")!.innerHTML = unlocked_icon;
    } else {
      document.getElementById("editing-lock")!.innerHTML = locked_icon;
    }
  } else {
    globalThis.is_editing_mode = false;
    document.getElementById("editing-lock")!.innerHTML = "";
    document.getElementById("loginButton")!.addEventListener("click", () => {
      signInWithRedirect(globalThis.auth, new GoogleAuthProvider());
    });
    document.getElementById("loginButton")!.innerText = "Login";
  }

  if (location.pathname.includes("/procs/")) {
    generate_steps(true);
  }
  if (location.pathname.includes("/seating/") && globalThis.currently_selected_seating_chart) {
    draw_chart();
  }
}

export function toggleEditingStatus() {
  globalThis.is_editing_mode = !globalThis.is_editing_mode;
  updateLockouts();
}
