import { Component, createMemo, createSignal, For, Show } from "solid-js";
import Dialog from "@corvu/dialog";
import { useState } from "../../../state";
import { TestBasics } from "../../../types";
import TestEntry from "./test_button";
import styles from "../modal.module.css";
import RefreshListButton from "./refresh_list_button";
import { makePersisted } from "@solid-primitives/storage";
import TestSwitcherFilter from "./switcher_filter/switcher_filter";
import { getDateLabel } from "../../../browser/util";

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
    const tests_filtered = (allKnownTests() as TestBasics[]).filter(
      (obj) =>
        filters().includes(obj.gse_article) || filters().includes(obj.test_article) || filters().includes(obj.name)
    );
    const tests_unsorted: TestBasics[] = tests_filtered.length == 0 ? allKnownTests() : tests_filtered;
    const tests = tests_unsorted.sort(function (a, b) {
      if (a.test_article === b.test_article) {
        if (a.gse_article === b.gse_article) {
          if (a.starting_timestamp! == b.starting_timestamp!) {
            return b.name < a.name ? 1 : -1;
          } else if (a.starting_timestamp! < b.starting_timestamp!) {
            return 1;
          } else if (a.starting_timestamp! > b.starting_timestamp!) {
            return -1;
          }
        } else if (a.gse_article < b.gse_article) {
          return 1;
        } else if (a.gse_article < b.gse_article) {
          return -1;
        }
      } else if (a.test_article < b.test_article) {
        return 1;
      } else if (a.test_article < b.test_article) {
        return -1;
      }
      return -1;
    });
    return tests;
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
          <For each={filteredTestEntries()}>
            {(item, index) => (
              <TestEntry test_id={item.id}>
                {item.test_article}:{item.gse_article}:{getDateLabel(item.starting_timestamp!)}:{item.name}
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
