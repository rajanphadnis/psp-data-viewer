import { Component, createSignal } from "solid-js";
import styles from "./column.module.css";
import { StateType, useState } from "../../state";
import Resizable from "corvu/resizable";
import { makePersisted } from "@solid-primitives/storage";
import ZoomButtons from "./zoom_buttons";
import PanelActiveDatasets from "./panels/active_datasets";
import PanelDatasetSelector from "./panels/dataset_selector";
import PanelTools from "./panels/tools";

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
    {
      addDataset,
      updateDataset,
      removeDataset,
      updateColor,
    },
  ] = useState() as StateType;
  const [sizes, setSizes] = makePersisted(createSignal<number[]>([]), {
    name: "resizable-sizes",
  });

  return (
    <div class={styles.vertical}>
      <Resizable
        orientation="vertical"
        class={styles.datasetSelector}
        initialSizes={[0.15, 0.6, 0.25]}
        sizes={sizes()}
        onSizesChange={setSizes}
      >
        <PanelActiveDatasets />
        <Resizable.Handle class={styles.handle}>
          <hr />
        </Resizable.Handle>
        <PanelDatasetSelector />
        <Resizable.Handle class={styles.handle}>
          <hr />
        </Resizable.Handle>
        <PanelTools />
      </Resizable>
      <ZoomButtons />
    </div>
  );
};

export default ControlColumn;
