import Resizable from "@corvu/resizable";
import { makePersisted } from "@solid-primitives/storage";
import { Accessor, Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { getTestInfo } from "../../../db/db_interaction";
import { useState } from "../../../state";
import { TestBasics, TestData } from "../../../types";
import loaderStyles from "../../header/header.module.css";
import SectionTitle from "../../title";
import { EditorDatasetButton, EditorDeleteButton, EditorEntry } from "./editor_entry";
import EditorSaveButton from "./editor_save";

const HomeEditor: Component<{ testBasics: Accessor<TestBasics> }> = (props) => {
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
  const [testData, setTestData] = createSignal<TestData>({
    datasets: [""],
    ending_timestamp: 0,
    gse_article: "",
    id: "",
    name: "",
    test_article: "",
    starting_timestamp: 0,
  });
  const [name, setName] = createSignal<string>("");
  const [gseArticle, setGseArticle] = createSignal<string>("");
  const [testArticle, setTestArticle] = createSignal<string>("");
  const [sizes, setSizes] = makePersisted(createSignal<number[]>([]), {
    name: "resizable-index-sizes-datasetsList",
  });
  const [loading, setloading] = createSignal<boolean>(true);

  createEffect(async () => {
    const id_to_fetch = props.testBasics();
    if (id_to_fetch.id != "") {
      setloading(true);
      const localData = await getTestInfo(id_to_fetch.id, setTestData);
      setName(localData.name);
      setGseArticle(localData.gse_article);
      setTestArticle(localData.test_article);
      setloading(false);
    }
  });

  const isChanged = createMemo(() => {
    const nameChange = name() != testData().name;
    const gseChange = gseArticle() != testData().gse_article;
    const testChange = testArticle() != testData().test_article;

    return nameChange || gseChange || testChange;
  });

  const timeRange = createMemo(() => {
    return `${testData().starting_timestamp} --> ${testData().ending_timestamp}`;
  });

  const permissions = createMemo(() => auth());

  return (
    <div style={{ "padding-left": "10px", "padding-right": "10px", height: "100%" }}>
      <Show when={!loading()} fallback={<div class={loaderStyles.loader}></div>}>
        <Resizable sizes={sizes()} onSizesChange={setSizes} orientation="vertical">
          <Resizable.Panel initialSize={0.55} minSize={0.55} class="panel panelPadding">
            <div class="flex flex-row justify-between items-center">
              <SectionTitle title="Edit Test:" />
              <Show when={permissions()! && permissions()!.includes(`${org()}:delete:tests`)}>
                <EditorDeleteButton id={testData().id} slug={org()!} />
              </Show>
            </div>
            <EditorEntry testData={testData().id} name="Test ID" input={false} />
            <EditorEntry testData={timeRange()} name="Timestamp" input={false} />
            <EditorEntry
              testData={testData().name}
              name="Test Name"
              input={(permissions()! && permissions()!.includes(`${org()}:manage:tests`)) ? true : false}
              setter={setName}
            />
            <EditorEntry
              testData={testData().test_article}
              name="Test Article"
              input={(permissions()! && permissions()!.includes(`${org()}:manage:tests`)) ? true : false}
              setter={setTestArticle}
            />
            <EditorEntry
              testData={testData().gse_article}
              name="GSE Article"
              input={(permissions()! && permissions()!.includes(`${org()}:manage:tests`)) ? true : false}
              setter={setGseArticle}
            />
            <Show when={isChanged()}>
              <EditorSaveButton
                testData={testData}
                name={name}
                testArticle={testArticle}
                gseArticle={gseArticle}
                setloading={setloading}
              />
            </Show>
          </Resizable.Panel>
          <Resizable.Handle aria-label="Resize Handle" class="bg-transparent border-none px-0 py-2">
            <div class="h-[2px] bg-white w-full" />
          </Resizable.Handle>
          <Resizable.Panel
            initialSize={0.45}
            minSize={0.2}
            collapsedSize={0}
            collapsible={true}
            class="panel"
            style={{ overflow: "auto", "scrollbar-color": "white transparent" }}
          >
            <SectionTitle title={`Test Datasets (x${testData().datasets.length}):`} />
            <For each={testData().datasets}>
              {(item, index) => {
                return <EditorDatasetButton dataset={item} />;
              }}
            </For>
          </Resizable.Panel>
        </Resizable>
      </Show>
    </div>
  );
};

export default HomeEditor;
