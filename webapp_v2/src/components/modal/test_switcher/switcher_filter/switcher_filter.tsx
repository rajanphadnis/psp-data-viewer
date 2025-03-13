import { Component, For } from "solid-js";
import { StateType, useState } from "../../../../state";
import { TestBasics } from "../../../../types";
import FilterButton from "./filter_button";

const TestSwitcherFilter: Component<{
  setFilters: (newFilters: string[]) => void;
  filters: () => string[];
}> = (props) => {
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
    annotations,
    setAnnotations,
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;

  return (
    <div class="flex flex-row justify-start p-2.5">
      <p>Filter: </p>
      <For
        each={[
          ...new Set<string>(
            allKnownTests().map((test: TestBasics) => test.gse_article),
          ),
          ...new Set<string>(
            allKnownTests().map((test: TestBasics) => test.test_article),
          ),
        ]}
      >
        {(item, index) => (
          <FilterButton
            name={item}
            isActive={props.filters().includes(item)}
            onclick={() => {
              let newList = [...props.filters()];
              if (props.filters().includes(item)) {
                const index = newList.indexOf(item);
                newList.splice(index, 1);
              } else {
                newList.push(item);
              }
              props.setFilters([...newList]);
            }}
          />
        )}
      </For>
    </div>
  );
};

export default TestSwitcherFilter;
