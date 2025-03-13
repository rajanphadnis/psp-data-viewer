import { makePersisted } from "@solid-primitives/storage";
import Resizable from "corvu/resizable";
import { Component, createSignal } from "solid-js";
import { StateType, useState } from "../../state";
import PanelActiveDatasets from "./panels/active_datasets";
import PanelDatasetSelector from "./panels/dataset_selector";
import PanelTools from "./panels/tools";
import ZoomButtons from "./zoom_buttons";

const ControlColumn: Component<{}> = (props) => {
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
  const [sizes, setSizes] = makePersisted(createSignal<number[]>([]), {
    name: "resizable-sizes",
  });

  return (
    <div class="m-0 flex w-3/20 flex-col p-0">
      <Resizable
        orientation="vertical"
        class="scrollbar-white h-[calc(100vh-50px-50px)] max-h-[calc(100vh-50px-50px)] justify-start overflow-hidden pt-1.25 pl-1.25"
        initialSizes={[0.15, 0.6, 0.25]}
        sizes={sizes()}
        onSizesChange={setSizes}
      >
        <PanelActiveDatasets />
        <Resizable.Handle class="border-none bg-transparent py-2">
          <hr />
        </Resizable.Handle>
        <PanelDatasetSelector />
        <Resizable.Handle class="border-none bg-transparent py-2">
          <hr />
        </Resizable.Handle>
        <PanelTools />
      </Resizable>
      <ZoomButtons />
    </div>
  );
};

export default ControlColumn;
