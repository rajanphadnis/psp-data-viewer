import { Component, createEffect, createMemo, Show } from "solid-js";
import styles from "./header.module.css";
import { useState } from "../../state";
import { A } from "@solidjs/router";

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
    return org() ?? "general";
  });

  return (
    <A href={auth() != null ? `/${orgSlug()}/logout` : `/${orgSlug()}/login`}>
      <button title="Login or Logout" class={styles.authButton}>
        <Show when={auth() != null} fallback={"Login"}>
          Logout
        </Show>
      </button>
    </A>
  );
};

export default AuthButton;
