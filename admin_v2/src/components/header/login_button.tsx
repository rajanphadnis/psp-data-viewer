import { Component, Show } from "solid-js";
import styles from "./header.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "../../state";

const AuthButton: Component<{}> = () => {
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
  ] = useState();

  return (
    <a href={auth() != null ? "/logout" : "/login"}>
      <button title="Login or Logout" class={styles.authButton}>
        <Show when={auth() != null} fallback={"Login"}>
          Logout
        </Show>
      </button>
    </a>
  );
};

export default AuthButton;
