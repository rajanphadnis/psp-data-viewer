import { Component, For } from "solid-js";
import styles from "./switcher.module.css";
import { useState } from "../../../state";
import { TestBasics } from "../../../types";
import FilterButton from "./filter_button";

const TestSwitcherFilter: Component<{}> = (props) => {
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
    <div class={styles.filterDiv}>
      <p>Filter: </p>
      <For
        each={[
          ...new Set<string>(allKnownTests().map((test: TestBasics) => test.gse_article)),
          ...new Set<string>(allKnownTests().map((test: TestBasics) => test.test_article)),
        ]}
      >
        {(item, index) => (
          <FilterButton
            name={item}
            onclick={() => {
              console.log({ item });
            }}
          />
        )}
      </For>
    </div>
  );
};

export default TestSwitcherFilter;
