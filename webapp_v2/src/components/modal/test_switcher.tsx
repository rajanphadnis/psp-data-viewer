import { Accessor, Component, For } from "solid-js";
import Dialog from "@corvu/dialog";
import "./modal.module.css";
import { useState } from "../../state";
import { TestBasics } from "../../types";
import TestEntry from "./test_button";
import styles from "./modal.module.css";

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
  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class={styles.switcherModal}>
        <Dialog.Label>Select Test</Dialog.Label>
        <div class={styles.switcherModalDescription}>
          <For each={allKnownTests() as TestBasics[]}>
            {(item, index) => (
              <TestEntry test_id={item.id}>
                {item.test_article}:{item.gse_article}:{item.name}
              </TestEntry>
            )}
          </For>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default TestSwitcherModal;
