import { Accessor, Component, createSignal, Show } from "solid-js";
import { runRequest } from "../../db/azure_interaction";
import { useState } from "../../state";

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
      // class={styles.configButton}
      class="m-3 p-5 w-full text-black font-bold cursor-pointer flex flex-row justify-center items-center text-center bg-rush hover:bg-rush-light disabled:bg-lime-400"

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
      <Show when={!loading()} fallback={<div class="loader animate-spin-xtrafast w-4 h-4 border-t-2 border-2 border-t-black border-transparent"></div>}>
        <Show when={!isUpdateComplete()} fallback={"Instance Count Updated"}>
          Finalize
        </Show>
      </Show>
    </button>
  );
};

export default InstanceUpdateButton;
