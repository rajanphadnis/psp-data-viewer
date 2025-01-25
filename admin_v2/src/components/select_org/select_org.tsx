import { Component, For, onMount } from "solid-js";
import { config } from "../../generated_app_check_secret";
import { A } from "@solidjs/router";
import { useState } from "../../state";

const SelectOrg: Component<{}> = (props) => {
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
  onMount(() => {
    setLoadingState({ isLoading: false, statusMessage: "" });
  });
  return (
    <div class="flex flex-col w-full h-[calc(100%-4rem)] justify-center items-center">
      <h1 class="font-bold text-xl mb-3">Select Org:</h1>
      <For each={Object.keys(config)}>
        {(slug, index) => {
          const name = (config as any)[slug]["naming"]["name_long"] as string;
          return <A href={`/${slug}/`} class="p-3 border border-white rounded-lg my-3 hover:bg-neutral-600" onclick={() => {
            setLoadingState({ isLoading: true, statusMessage: "configuring DB..." })
          }}>{name}</A>;
        }}
      </For>
    </div>
  );
};

export default SelectOrg;
