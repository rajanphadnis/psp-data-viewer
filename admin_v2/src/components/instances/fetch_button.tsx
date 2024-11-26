import { Component, createSignal, Setter, Show } from "solid-js";
import styles from "./instances.module.css";
import { useState } from "../../state";
import { runRequest } from "../../db/azure_interaction";

const InstancesFetchButton: Component<{ setCurrentConfig: Setter<string> }> = (props) => {
  const [allKnownTests, setAllKnownTests, loadingState, setLoadingState]: any = useState();
  const [loading, setloading] = createSignal<boolean>(false);

  return (
    <button
      id="instanceManager_fetchButton"
      title="Get Config"
      class={styles.configButton}
      on:click={async () => {
        props.setCurrentConfig("");
        setLoadingState({ isLoading: true, statusMessage: "Fetching..." });
        setloading(true);
        const newConfig = await runRequest(true);
        props.setCurrentConfig(newConfig);
        setloading(false);
        setLoadingState({ isLoading: false, statusMessage: "" });
      }}
    >
      <Show when={!loading()} fallback={<div class={styles.buttonLoader}></div>}>
        Get Current Config
      </Show>
    </button>
  );
};

export default InstancesFetchButton;
