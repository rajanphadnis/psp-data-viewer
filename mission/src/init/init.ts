import { getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from "firebase/auth";

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
        signOut(globalThis.auth).then(() => {
          // Sign-out successful.
          window.location.pathname = window.location.pathname;
        }).catch((error) => {
          // An error happened.
        });
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
