import { Component, createMemo, createSignal, For } from "solid-js";
import Resizable from "@corvu/resizable";
import styles from "../resizeable.module.css";
import home from "./home.module.css";
import { useState } from "../../state";
import HomeNavbarItem from "./navbar_item";
import { TestBasics } from "../../types";
import { makePersisted } from "@solid-primitives/storage";
import TestSwitcherFilter from "./switcher_filter/switcher_filter";
import HomeEditor from "./editor/editor";

const init_testData: TestBasics = {
  name: "Loading...",
  gse_article: "",
  test_article: "",
  id: "",
  starting_timestamp: 0,
  ending_timestamp: 0,
  datasets: [""],
};

const HomeComponent: Component<{}> = (props) => {
  const [allKnownTests, setAllKnownTests, loadingState, setLoadingState]: any = useState();

  const [filters, setFilters] = makePersisted(createSignal<string[]>([]), {
    name: "test-filters",
  });

  const [selected, setSelected] = createSignal<string>("");

  const filteredTestEntries = createMemo<TestBasics[]>(() => {
    return (allKnownTests() as TestBasics[]).filter(
      (obj) =>
        filters().includes(obj.gse_article) || filters().includes(obj.test_article) || filters().includes(obj.name)
    );
  });

  const currentlySelectedTest = createMemo<TestBasics>(() => {
    if (selected() == "") {
      const default_test = filteredTestEntries().length == 0 ? allKnownTests()[0] : filteredTestEntries()[0];
      return default_test;
    } else {
      const test = (allKnownTests() as TestBasics[]).filter((e) => e.id == selected())[0];
      return test;
    }
  });

  return (
    <Resizable>
      <Resizable.Panel initialSize={0.4} minSize={0.2} class={`${styles.panel} ${styles.panelPadding}`}>
        <div class={home.homeNavBar}>
          <TestSwitcherFilter setFilters={setFilters} filters={filters} />
          <For each={filteredTestEntries().length == 0 ? (allKnownTests() as TestBasics[]) : filteredTestEntries()}>
            {(item, index) => {
              return <HomeNavbarItem test={item} setter={setSelected} active={currentlySelectedTest().id == item.id} />;
            }}
          </For>
        </div>
      </Resizable.Panel>
      <Resizable.Handle aria-label="Resize Handle" class={styles.panel_handle}>
        <div class={styles.panel_handle_div} />
      </Resizable.Handle>
      <Resizable.Panel initialSize={0.6} minSize={0.2} class={`${styles.panel} ${styles.panelPadding}`}>
        <HomeEditor testBasics={currentlySelectedTest} />
      </Resizable.Panel>
    </Resizable>
  );
};

export default HomeComponent;
