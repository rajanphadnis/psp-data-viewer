import { Accessor, Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { TestBasics, TestData } from "../../../types";
import { getTestInfo } from "../../../db/db_interaction";
import loaderStyles from "../../header/header.module.css";

const HomeEditor: Component<{ testBasics: Accessor<TestBasics> }> = (props) => {
  const [testData, setTestData] = createSignal<TestData>({
    datasets: [""],
    ending_timestamp: 0,
    gse_article: "",
    id: "",
    name: "",
    test_article: "",
    starting_timestamp: 0,
  });

  const [loading, setloading] = createSignal<boolean>(true);

  createEffect(async () => {
    const id_to_fetch = props.testBasics();
    console.log(id_to_fetch.id);
    setloading(true);
    await getTestInfo(id_to_fetch.id, setTestData);
    setloading(false);
  });

  return (
    <div>
      <Show when={!loading()} fallback={<div class={loaderStyles.loader}></div>}>
        {testData().datasets}
      </Show>
    </div>
  );
};

export default HomeEditor;
