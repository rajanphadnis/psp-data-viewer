import { Accessor, Component, createMemo, createSignal, For, on, Show } from "solid-js";
import Dialog from "@corvu/dialog";
import "./modal.module.css";
import { useState } from "../../state";
import { TestBasics } from "../../types";
import TestEntry from "./test_button";
import styles from "./modal.module.css";
import RefreshListButton from "./refresh_list_button";
import { makePersisted } from "@solid-primitives/storage";
import TestSwitcherFilter from "./switcher_filter/switcher_filter";

const TestSwitcherModal: Component<{}> = (props) => {
  const [
    activeDatasets,
    setActiveDatasets,
    appReadyState,
    setAppReadyState,
    loadingState,
    setLoadingState,
    testBasics,
    setTestBasics,
    allKnownTests,
    setAllKnownTests,
    datasetsLegendSide,
    setDatasetsLegendSide,
    plotRange,
    setPlotRange,
    plotPalletteColors,
    setPlotPalletteColors,
    sitePreferences,
    setSitePreferences,
    loadingDatasets,
    setLoadingDatasets,
    measuring,
    setMeasuring,
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();

  const [filters, setFilters] = makePersisted(createSignal<string[]>([]), {
    name: "test-filters",
  });

  const filteredTestEntries = createMemo<TestBasics[]>(() => {
    return (allKnownTests() as TestBasics[]).filter(
      (obj) =>
        filters().includes(obj.gse_article) || filters().includes(obj.test_article) || filters().includes(obj.name)
    );
  });

  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class={styles.switcherModal}>
        <Dialog.Label>
          Select Test <RefreshListButton />
        </Dialog.Label>
        <div class={styles.switcherModalDescription}>
          <TestSwitcherFilter setFilters={setFilters} filters={filters} />
          <For each={filteredTestEntries().length == 0 ? allKnownTests() : filteredTestEntries()}>
            {(item, index) => (
              <TestEntry test_id={item.id}>
                {item.test_article}:{item.gse_article}:{item.name}{" "}
                <Show when={item.id == globalThis.default_id}>(Default)</Show>
              </TestEntry>
            )}
          </For>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default TestSwitcherModal;
