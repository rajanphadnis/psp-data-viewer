import { Component, createEffect, createSignal, Show } from "solid-js";
import { genId } from "../../browser_interactions";
import { useState } from "../../state";
import UploadEditLayout from "./edit/layout";
import UploadFinalizeLayout from "./finalize";

const NewTest: Component<{}> = (props) => {
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
  const [id, setId] = createSignal<string>(genId(7));
  const [isFinalizing, setisFinalizing] = createSignal<boolean>(false);
  const [name, setName] = createSignal<string>("");
  const [testArticle, setTestArticle] = createSignal<string>("");
  const [gseArticle, setGseArticle] = createSignal<string>("");
  const [filePath, setFilePath] = createSignal<File>();


  createEffect(() => {
    setGseArticle(defaultGSE());
    setTestArticle(defaultTestArticle());
  });

  return (
    <Show
      when={isFinalizing()}
      fallback={
        <UploadEditLayout
          name={name}
          testArticle={testArticle}
          gseArticle={gseArticle}
          filePath={filePath}
          setisFinalizing={setisFinalizing}
          setName={setName}
          setTestArticle={setTestArticle}
          setGseArticle={setGseArticle}
          setFilePath={setFilePath}
        />
      }
    >
      <UploadFinalizeLayout
        name={name}
        testArticle={testArticle}
        gseArticle={gseArticle}
        filePath={filePath}
        id={id}
      />
    </Show>
  );
};

export default NewTest;
