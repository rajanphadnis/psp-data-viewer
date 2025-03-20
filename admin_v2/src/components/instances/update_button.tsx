import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  Accessor,
  Component,
  createEffect,
  createMemo,
  createSignal,
  Show,
} from "solid-js";
import { runRequest } from "../../db/azure_interaction";
import { useState } from "../../state";

const InstanceUpdateButton: Component<{ instanceCount: Accessor<number> }> = (
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
  const [isUpdateComplete, setisUpdateComplete] = createSignal<boolean>(false);
  const [loading, setloading] = createSignal<boolean>(false);

  

  return (
    <button
      title="Set Instance Count"
      // class={styles.configButton}
      class="bg-rush hover:bg-rush-light m-3 flex w-full cursor-pointer flex-row items-center justify-center p-5 text-center font-bold text-black disabled:bg-lime-400"
      on:click={async () => {
        setLoadingState({ isLoading: true, statusMessage: "Setting..." });
        setloading(true);
        const result = await runRequest(false, props.instanceCount(), org()!);
        console.log(result);
        setisUpdateComplete(true);
        setloading(false);
        setLoadingState({ isLoading: false, statusMessage: "" });
        document.getElementById("instanceManager_fetchButton")!.click();
      }}
      disabled={isUpdateComplete()}
    >
      <Show
        when={!loading()}
        fallback={
          <div class="loader animate-spin-xtrafast h-4 w-4 border-2 border-t-2 border-transparent border-t-black"></div>
        }
      >
        <Show when={!isUpdateComplete()} fallback={"Instance Count Updated"}>
          Finalize
        </Show>
      </Show>
    </button>
  );
};

export default InstanceUpdateButton;
