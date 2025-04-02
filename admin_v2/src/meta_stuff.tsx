import { MetaProvider, Title } from "@solidjs/meta";
import { Component, onMount, Show } from "solid-js";
import { useState } from "./state";
import { firebaseConfig } from "./db/firebase_init";

const MetaStuff: Component<{}> = (props) => {
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
    const s = document.createElement("script");
    s.setAttribute(
      "src",
      `https://www.googletagmanager.com/gtag/js?id=${firebaseConfig.measurementId}`,
    );
    s.async = true;
    document.head.appendChild(s);
    const dataLayer = (window.dataLayer = window.dataLayer || []);
    function gtag(a: string, b: string | object) {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", firebaseConfig.measurementId);
  });

  return (
    <MetaProvider>
      <Show when={!loadingState().isLoading} fallback={<Title>Loading...</Title>}>
        <Title>Admin Console</Title>
      </Show>
    </MetaProvider>
  );
};

export default MetaStuff;
