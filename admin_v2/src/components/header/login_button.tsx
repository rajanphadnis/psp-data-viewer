import { Component, createEffect, createMemo, Show } from "solid-js";
import styles from "./header.module.css";
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
    org,
    setOrg,
  ] = useState();
  const orgSlug = createMemo(() => {
    console.log(org());
    return org() ?? "general";
  });

  return (
    <a href={auth() != null ? `/${orgSlug()}/logout` : `/${orgSlug()}/login`}>
      <button title="Login or Logout" class={styles.authButton}>
        <Show when={auth() != null} fallback={"Login"}>
          Logout
        </Show>
      </button>
    </a>
  );
};

export default AuthButton;
