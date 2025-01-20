import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import UploadEditLayout from "./edit/layout";
import UploadFinalizeLayout from "./finalize/layout";
import { genId } from "../../browser_interactions";
import { useState } from "../../state";

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
  ] = useState();
  const [id, setId] = createSignal<string>(genId(7));
  const [isFinalizing, setisFinalizing] = createSignal<boolean>(false);
  const [name, setName] = createSignal<string>("");
  const [testArticle, setTestArticle] = createSignal<string>("");
  const [gseArticle, setGseArticle] = createSignal<string>("");
  const [filePaths, setFilePaths] = createSignal<File[]>(new Array<File>());
  const [isHDF5, setIsHDF5] = createSignal<boolean>(false);
  const [tdmsDelayStr, setTdmsDelay] = createSignal<string>("0");

  const tdmsDelay = createMemo(() => {
    if (tdmsDelayStr() == "") {
      return 0;
    }
    return parseInt(tdmsDelayStr());
  });

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
          filePaths={filePaths}
          isHDF5={isHDF5}
          setisFinalizing={setisFinalizing}
          setName={setName}
          setTestArticle={setTestArticle}
          setGseArticle={setGseArticle}
          setFilePaths={setFilePaths}
          setIsHDF5={setIsHDF5}
          tdmsDelay={tdmsDelay}
          setTdmsDelay={setTdmsDelay}
        />
      }
    >
      <UploadFinalizeLayout
        name={name}
        testArticle={testArticle}
        gseArticle={gseArticle}
        filePaths={filePaths}
        isHDF5={isHDF5}
        id={id}
        tdmsDelay={tdmsDelay}
      />
    </Show>
  );
};

export default NewTest;
