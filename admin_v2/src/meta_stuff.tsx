import { MetaProvider, Title } from "@solidjs/meta";
import { Component, Show } from "solid-js";
import { useState } from "./state";

const MetaStuff: Component<{}> = (props) => {
  const [allKnownTests, setAllKnownTests, loadingState, setLoadingState]: any = useState();

  return (
    <MetaProvider>
      <Show when={!loadingState().isLoading} fallback={<Title>Loading...</Title>}>
        <Title>Admin Console</Title>
      </Show>
    </MetaProvider>
  );
};

export default MetaStuff;
