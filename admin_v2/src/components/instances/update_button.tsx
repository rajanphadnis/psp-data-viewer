import { Accessor, Component, createSignal, Show } from "solid-js";
import styles from "./instances.module.css";
import { useState } from "../../state";
import { runRequest } from "../../db/azure_interaction";

const InstanceUpdateButton: Component<{ instanceCount: Accessor<number> }> = (props) => {
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
  const [isUpdateComplete, setisUpdateComplete] = createSignal<boolean>(false);
  const [loading, setloading] = createSignal<boolean>(false);
  return (
    <button
      title="Set Instance Count"
      class={styles.configButton}
      on:click={async () => {
        setLoadingState({ isLoading: true, statusMessage: "Setting..." });
        setloading(true);
        const result = await runRequest(false, props.instanceCount());
        console.log(result);
        setisUpdateComplete(true);
        setloading(false);
        setLoadingState({ isLoading: false, statusMessage: "" });
        document.getElementById("instanceManager_fetchButton")!.click();
      }}
      disabled={isUpdateComplete()}
    >
      <Show when={!loading()} fallback={<div class={styles.buttonLoader}></div>}>
        <Show when={!isUpdateComplete()} fallback={"Instance Count Updated"}>
          Finalize
        </Show>
      </Show>
    </button>
  );
};

export default InstanceUpdateButton;
