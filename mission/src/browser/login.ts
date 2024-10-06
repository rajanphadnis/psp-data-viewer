// import firebase from "firebase/compat/app";

import {
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  getAdditionalUserInfo,
} from "firebase/auth";

export async function login() {
  await getRedirectResult(globalThis.auth)
    .then((result) => {
      const user = result?.user;
      console.log("logged in");
      if (result) {
        const thing = getAdditionalUserInfo(result);
        console.log(thing);
      }
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(error);
      // ...
    });
}
