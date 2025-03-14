import { Component, createSignal, Show } from "solid-js";
import { downloadCSV } from "../../../../browser/csv";
import { delay } from "../../../../browser/util";
import { StateType, useState } from "../../../../state";
import CheckIcon from "../../../icons/check";
import IconCSV from "../../../icons/csv";
import IconButton from "./icon_button";

const ToolDownloadCSV: Component<{}> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);
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
    currentAnnotation,
    setCurrentAnnotation,
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;
  return (
    <button
      class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25"
      onclick={async () => {
        downloadCSV(activeDatasets(), plotRange().start, plotRange().end);
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <IconButton>
        <Show
          when={!showDone()}
          fallback={<CheckIcon class="w-5 fill-lime-400" />}
        >
          <IconCSV class="w-3.75 fill-black" />
        </Show>
      </IconButton>
      <p class="m-0 text-xs font-bold text-black">
        <Show when={!showDone()} fallback={"Downloaded!"}>
          Download Data as CSV
        </Show>
      </p>
    </button>
  );
};

export default ToolDownloadCSV;
