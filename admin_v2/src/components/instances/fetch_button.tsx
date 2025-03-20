import { Component, createSignal, Setter, Show } from "solid-js";
import { runRequest } from "../../db/azure_interaction";
import { useState } from "../../state";

const InstancesFetchButton: Component<{ setCurrentConfig: Setter<string> }> = (
  props,
) => {
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
      class="bg-rush hover:bg-rush-light m-3 flex w-full cursor-pointer flex-row items-center justify-center p-5 text-center font-bold text-black disabled:bg-lime-400"
      // class={styles.configButton}
      on:click={async () => {
        props.setCurrentConfig("");
        setLoadingState({ isLoading: true, statusMessage: "Fetching..." });
        setloading(true);
        const newConfig = await runRequest(true, undefined, org()!);
        props.setCurrentConfig(newConfig);
        setloading(false);
        setLoadingState({ isLoading: false, statusMessage: "" });
      }}
    >
      <Show
        when={!loading()}
        fallback={
          <div class="loader animate-spin-xtrafast h-4 w-4 border-2 border-t-2 border-transparent border-t-black"></div>
        }
      >
        Hard Fetch Current Config
      </Show>
    </button>
  );
};

export default InstancesFetchButton;
