// import firebase from "firebase/compat/app";

import { GoogleAuthProvider, EmailAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

export async function login() {
  console.log("getting redirect result");
  await getRedirectResult(globalThis.auth)
    .then((result) => {
      console.log("got redirect result");
      // This gives you a Google Access Token. You can use it to access Google APIs.
      //   const credential = GoogleAuthProvider.credentialFromResult(result!)!;
      //   const token = credential.accessToken;

      // The signed-in user info.
      console.log(result);
      const user = result?.user;
      if (user) {
        window.location.href = "https://www.google.com";
      }
      // IdP data available using getAdditionalUserInfo(result)
      // ...
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
