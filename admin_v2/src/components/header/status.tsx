import { Component, createEffect, Show } from "solid-js";
import styles from "./header.module.css";
import CheckIcon from "../icons/check";
import { useState } from "../../state";

const Status: Component<{}> = (props) => {
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
  ] = useState();

  return (
    <div class={styles.status}>
      <p class={styles.statusMessage}>{loadingState().isLoading ? loadingState().statusMessage : "Ready"}</p>
      <Show when={loadingState().isLoading} fallback={<CheckIcon />}>
        <div class={styles.loader}></div>
      </Show>
    </div>
  );
};

export default Status;
