import { getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from "firebase/auth";

export function initGlobalVars() {
  globalThis.visible_procs = [];
  globalThis.mission_name = "Loading...";
  globalThis.steps = [];
}

export async function initNavbar() {
  // await
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      document.getElementById("loginButton")!.addEventListener("click", () => {
        window.location.pathname = "/logout/";
      });
      document.getElementById("loginButton")!.innerText = "Logout";
      // ...
    } else {
      // User is signed out
      // ...
      document.getElementById("loginButton")!.addEventListener("click", () => {
        signInWithRedirect(globalThis.auth, new GoogleAuthProvider());
      });
      document.getElementById("loginButton")!.innerText = "Login";
    }
  });
}
