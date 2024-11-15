import { Component, createSignal, For, Show } from "solid-js";
import styles from "./column.module.css";
import DatasetSelector from "./dataset_selector/dataset_selector";
import { useState } from "../../state";
import DatasetListSelector from "./dataset_selector/list_selecttor";
import Resizable from "corvu/resizable";
import { makePersisted } from "@solid-primitives/storage";
import ToolCopyImage from "./tools/copy_image";
import ToolDownloadImage from "./tools/download_image";
import ToolDownloadCSV from "./tools/download_csv";
import Popover from '@corvu/popover'

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
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();
  const [sizes, setSizes] = makePersisted(createSignal<number[]>([]), {
    name: "resizable-sizes",
  });
  return (
    <Resizable
      orientation="vertical"
      class={styles.datasetSelector}
      initialSizes={[0.15, 0.6, 0.25]}
      sizes={sizes()}
      onSizesChange={setSizes}
    >
      <Resizable.Panel class={styles.panel} minSize={0.1}>
        <div class={styles.titleDiv}>
          <h3 class={styles.title}>Active Datasets:</h3>
        </div>
        <For each={activeDatasets()}>{(item, index) => <DatasetSelector dataset_id={item}></DatasetSelector>}</For>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel class={styles.panel} minSize={0.25} collapsedSize={0.025} collapsible={true}>
        <div class={styles.titleDiv}>
          <h3 class={styles.title}>Available Datasets:</h3>
        </div>
        <For
          each={
            testBasics().datasets != undefined
              ? testBasics().datasets.filter((element: string[]) => !activeDatasets().includes(element))
              : []
          }
        >
          {(item, index) => <DatasetListSelector dataset_id={item} />}
        </For>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel class={styles.panel} minSize={0.15} collapsedSize={0.025} collapsible={true}>
        <div class={styles.titleDiv}>
          <h3 class={styles.title}>Tools:</h3>
        </div>
        <ToolCopyImage />
        <ToolDownloadImage />
        <ToolDownloadCSV />
        {/* <Popover>
<Popover.Anchor>
  <Popover.Trigger />
</Popover.Anchor>
<Popover.Portal>
  <Popover.Overlay />
  <Popover.Content>
    <Popover.Arrow />
    <Popover.Close />
    <Popover.Label />
    <Popover.Description />
  </Popover.Content>
</Popover.Portal>
</Popover> */}
      </Resizable.Panel>
    </Resizable>
  );
};

export default ControlColumn;
