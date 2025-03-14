import Resizable from "corvu/resizable";
import { Component, Show } from "solid-js";
import { StateType, useState } from "../../../state";
import NoDatasetsMessage from "../no_datasets";
import DataExportButton from "./tools/data_export_button";
import ToolEasterEgg from "./tools/easter";
import ToolMeasure from "./tools/measure";

const PanelTools: Component<{}> = (props) => {
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
    <Resizable.Panel
      class="overflow-auto"
      minSize={0.15}
      collapsedSize={0.025}
      collapsible={true}
    >
      <div class="flex w-full flex-row items-center justify-start pb-1.25">
        <h3 class="m-0 font-bold">Tools:</h3>
      </div>
      <Show
        when={activeDatasets().length > 0}
        fallback={
          <NoDatasetsMessage>
            <p class="m-0 px-2.5">No Datasets Selected</p>
          </NoDatasetsMessage>
        }
      >
        <DataExportButton />
        {/* <ToolCopyImage />
        <ToolDownloadImage />
        <ToolDownloadCSV /> */}
        <ToolMeasure />
        {/* <ToolCalcChannel /> */}
        <Show when={activeDatasets().length > 3}>
          <ToolEasterEgg />
        </Show>
      </Show>
    </Resizable.Panel>
  );
};

export default PanelTools;
