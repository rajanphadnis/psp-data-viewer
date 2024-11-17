import { Component, createMemo, For, Show } from "solid-js";
import styles from "./tools.module.css";
import IconButton from "./icon_button";
import Popover from "@corvu/popover";
import { formatTimeDelta } from "../../../../browser/measure";
import { useState } from "../../../../state";
import { SingleMeasurement } from "../../../../types";
import IconMeasure from "../../../icons/measure";

const ToolMeasure: Component<{}> = (props) => {
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

  const calculated_measurements = createMemo<SingleMeasurement[]>(() => {
    let toReturn: SingleMeasurement[] = [];
    activeDatasets().forEach((dataset: string) => {
      const name = dataset.split("__")[0];
      const units = dataset.split("__")[1];
      const y1 = measuring().y1;
      const y2 = measuring().y2;
      const dataPoint: SingleMeasurement = {
        name: name,
        units: units,
        measurement: (y2 - y1).toFixed(4),
      };
      toReturn.push(dataPoint);
    });
    return toReturn;
  });

  return (
    <Popover
      placement="left"
      floatingOptions={{
        offset: 20,
        flip: true,
        shift: true,
      }}
    >
      <Popover.Anchor>
        <Popover.Trigger class={styles.button}>
          <IconButton>
            <IconMeasure />
          </IconButton>
          <p class={styles.buttonTitle}>Measure</p>
        </Popover.Trigger>
      </Popover.Anchor>
      <Popover.Portal>
        {/* <Popover.Overlay /> */}
        <Popover.Content class={styles.popoverContent}>
          <Popover.Arrow />
          <Popover.Description>
            <Show when={measuring().x2 != undefined} fallback={<p>No measuring points</p>}>
              <For each={calculated_measurements()}>
                {(item, index) => {
                  const name = item.name;
                  const units = item.units;
                  const measurement = item.measurement;
                  return (
                    <p>
                      Δ{name}={measurement}
                      {units}
                    </p>
                  );
                }}
              </For>
              <p>Δtime={formatTimeDelta((measuring().x2 - measuring().x1) * 1000)}s</p>
            </Show>
          </Popover.Description>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};

export default ToolMeasure;
