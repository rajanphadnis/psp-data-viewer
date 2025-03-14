import {
  Accessor,
  Component,
  createSignal,
  JSX,
  Match,
  Switch,
} from "solid-js";
import { delay } from "../../../browser/util";
import { StateType, useState } from "../../../state";
import { LoadingState } from "../../../types";
import CheckIcon from "../../icons/check";
import XMark from "../../icons/x_mark";

const DataExportTypeButton: Component<{
  icon: JSX.Element;
  name: string;
  exportCurrentTime: Accessor<boolean>;
  exportCurrentChannels: Accessor<boolean>;
  exportHandler: (
    datasets: string[],
    starting_timestamp: number,
    ending_timestamp: number,
  ) => Promise<boolean>;
  available: boolean;
}> = (props) => {
  const [buttonLoadingState, setButtonLoadingState] =
    createSignal<LoadingState>(LoadingState.READY);
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
      onclick={(e) => {
        if (buttonLoadingState() == LoadingState.READY) {
          const starting_timestamp = props.exportCurrentTime()
            ? plotRange().start
            : testBasics().starting_timestamp!;
          const ending_timestamp = props.exportCurrentTime()
            ? plotRange().end
            : testBasics().ending_timestamp!;
          const datasets = props.exportCurrentChannels()
            ? activeDatasets()
            : testBasics().datasets!;
          setButtonLoadingState(LoadingState.LOADING);
          props
            .exportHandler(datasets, starting_timestamp, ending_timestamp)
            .then(async (result) => {
              console.log("result");
              console.log(result);
              if (result) {
                setButtonLoadingState(LoadingState.COMPLETE);
                await delay(1000);
                setButtonLoadingState(LoadingState.READY);
              } else {
                setButtonLoadingState(LoadingState.ERROR);
                console.error("Failed to export");
              }
            })
            .catch((err) => {
              setButtonLoadingState(LoadingState.ERROR);
              console.error(`Failed to export: ${err}`);
            });
        }
      }}
      class={`${buttonLoadingState() == LoadingState.READY ? "hover:bg-rush-light cursor-pointer" : ""} ${props.available ? "flex" : "hidden"} bg-rush mb-1 h-1/6 w-full flex-row items-center justify-start px-3 font-bold text-black`}
    >
      <Switch>
        <Match when={buttonLoadingState() == LoadingState.COMPLETE}>
          <CheckIcon class="w-3.75 fill-lime-400" />
          <p class="ml-3">Complete</p>
        </Match>
        <Match when={buttonLoadingState() == LoadingState.ERROR}>
          <XMark class="w-3.75 fill-red-600" />
          <p class="ml-3">Error</p>
        </Match>
        <Match when={buttonLoadingState() == LoadingState.READY}>
          {props.icon}
          <p class="ml-3">{props.name}</p>
        </Match>
        <Match when={buttonLoadingState() == LoadingState.LOADING}>
          Loading...
        </Match>
      </Switch>
    </button>
  );
};

export default DataExportTypeButton;
