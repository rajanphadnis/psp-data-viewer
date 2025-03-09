import { Component, createSignal, Setter, Show } from "solid-js";
import { runRequest } from "../../db/azure_interaction";
import { useState } from "../../state";

const InstancesFetchButton: Component<{ setCurrentConfig: Setter<string> }> = (props) => {
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
  const [loading, setloading] = createSignal<boolean>(false);

  return (
    <button
      id="instanceManager_fetchButton"
      title="Get Config"
      class="m-3 p-5 w-full text-black font-bold cursor-pointer flex flex-row justify-center items-center text-center bg-rush hover:bg-rush-light disabled:bg-lime-400"
      // class={styles.configButton}
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
      <Show when={!loading()} fallback={<div class="loader animate-spin-xtrafast w-4 h-4 border-t-2 border-2 border-t-black border-transparent"></div>}>
        Get Current Config
      </Show>
    </button>
  );
};

export default InstancesFetchButton;
