import { Component, createEffect, createSignal, JSX, onMount, Show } from "solid-js";
import {
  AuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import MainLayout from "../layout";
import styles from "./auth.module.css";
import sig from "./sign_in_with_google.module.css";
import { useState } from "../../state";
import { useNavigate } from "@solidjs/router";

export const AuthComponent: Component<{}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();

  createEffect(() => {
    if (org()) {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          const uid = user.uid;
          const email = user.email ?? user.providerData[0].email;
          user
            .getIdTokenResult()
            .then((idTokenResult) => {
              setAuth(idTokenResult.claims.permissions as string[]);
              setLoadingState({ isLoading: false, statusMessage: "" });
            })
            .catch((error) => {
              console.log(error);
              setAuth(null);
            });
        } else {
          setAuth(null);
        }
      });
    } else {
      console.debug("org not set");
    }
  });

  return <MainLayout />;
};

export const LogInComponent: Component<{}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();

  const [pendingCreds, setPendingCreds] = createSignal<any | null>(null);

  onMount(() => {
    if (auth()!) {
      const navigate = useNavigate();
      navigate(`/${org() ?? ""}`, { replace: true });
    }
  });

  return (
    <div class={styles.loginComponentDiv}>
      <p>Log In</p>
      <SignInButton name="Google" provider={new GoogleAuthProvider().addScope("email")} svg={GoogleSVG} />
      <SignInButton name="Microsoft" provider={new OAuthProvider("microsoft.com").addScope("email")} svg={MicrosoftSVG} />
      <SignInButton name="GitHub" provider={new GithubAuthProvider().addScope("user:email")} svg={GitHubSVG} />
    </div>
  );
};

const GoogleSVG = (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    style="display: block;"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    ></path>
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    ></path>
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    ></path>
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    ></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const MicrosoftSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
    <title>MS-SymbolLockup</title>
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

const GitHubSVG = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#ffffff"
      d="
m48.85,0 c-27.02,0,-48.85,22,-48.85,49.22 c0,21.76,13.99,40.17,33.41,46.69 c2.42,0.49,3.31,-1.06,3.31,-2.36 c0,-1.14,-0.08,-5.05,-0.08,-9.13 c-13.59,2.94,-16.42,-5.87,-16.42,-5.87 c-2.18,-5.7,-5.42,-7.17,-5.42,-7.17 c-4.45,-3.01,0.33,-3.01,0.33,-3.01 c4.93,0.32,7.52,5.05,7.52,5.05 c4.37,7.5,11.4,5.38,14.23,4.07 c0.41,-3.17,1.7,-5.37,3.08,-6.6 c-10.84,-1.14,-22.25,-5.37,-22.25,-24.28 c0,-5.38,1.94,-9.78,5.02,-13.2 c-0.49,-1.22,-2.19,-6.27,0.48,-13.04 c0,0,4.13,-1.3,13.43,5.06 a46.97,46.97,0,0,1,12.21,-1.63 c4.13,0,8.33,0.57,12.22,1.63 c9.3,-6.36,13.42,-5.06,13.42,-5.06 c2.67,6.77,0.97,11.82,0.49,13.04 c3.15,3.42,5.01,7.82,5.01,13.2 c0,18.91,-11.4,23.06,-22.32,24.28 c1.78,1.55,3.32,4.49,3.32,9.13 c0,6.6,-0.08,11.9,-0.08,13.53 c0,1.3,0.89,2.85,3.31,2.36 c19.41,-6.52,33.41,-24.93,33.41,-46.69 c0.08,-27.22,-21.84,-49.22,-48.77,-49.22 z
"
    ></path>
  </svg>
);

const SignInButton: Component<{ name: string; svg: JSX.Element; provider: AuthProvider }> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();
  return (
    <button
      class={sig.gsi_material_button}
      onclick={(e) => {
        setLoadingState({ isLoading: true, statusMessage: "Authenticating..." });
        // const provider = new GoogleAuthProvider();
        const auth = getAuth();
        console.log(props.provider);
        signInWithPopup(auth, props.provider)
          .then((result) => {
            const user = result.user;
            console.log(user);
            window.location.pathname = `/${org() ?? ""}`;
          })
          .catch((error) => {
            console.log(error);
            // console.log(error);
            // Step 2: User's email already exists.
            if (error.code === "auth/account-exists-with-different-credential") {
              // globalThis.errorThing = error;
              // console.log(error);
              // The pending Google credential.
              // let pendingCred = error.credential;
              // console.log(pendingCred);

              // Step 3: Save the pending credential in temporary storage,

              // Step 4: Let the user know that they already have an account
              // but with a different provider, and let them choose another
              // sign-in method.
              alert("Account already exists with another identity provider");
            }
          });
      }}
    >
      <div class={sig.gsi_material_button_state}></div>
      <div class={sig.gsi_material_button_content_wrapper}>
        <div class={sig.gsi_material_button_icon}>{props.svg}</div>
        <span class={sig.gsi_material_button_contents}>Continue with {props.name}</span>
        <span style="display: none;">Continue with {props.name}</span>
      </div>
    </button>
  );
};
