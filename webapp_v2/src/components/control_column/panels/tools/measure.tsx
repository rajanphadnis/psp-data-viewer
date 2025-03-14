import Popover from "@corvu/popover";
import { Component, createMemo, For, Show } from "solid-js";
import { formatTimeDelta } from "../../../../browser/measure";
import { StateType, useState } from "../../../../state";
import { SingleMeasurement } from "../../../../types";
import { IconOneKey, IconTwoKey } from "../../../icons/keys";
import IconMeasure from "../../../icons/measure";
import IconButton from "./icon_button";

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
    annotations,
    setAnnotations,
    currentAnnotation,
    setCurrentAnnotation,
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;

  const calculated_measurements = createMemo<SingleMeasurement[]>(() => {
    let toReturn: SingleMeasurement[] = [];
    for (let index = 0; index < activeDatasets().length; index++) {
      const dataset = activeDatasets()[index];
      const name = dataset.split("__")[0];
      const units = dataset.split("__")[1];
      if (units != "bin") {
        const y1 = measuring().y1[index];
        const y2 = measuring().y2[index];
        const dataPoint: SingleMeasurement = {
          name: name,
          units: units,
          measurement: (y2 - y1).toFixed(4),
        };
        toReturn.push(dataPoint);
      }
    }
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
        <Popover.Trigger class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25">
          <IconButton>
            <IconMeasure class="w-3.75 fill-black" />
          </IconButton>
          <p class="m-0 text-xs font-bold text-black">Measure</p>
        </Popover.Trigger>
      </Popover.Anchor>
      <Popover.Portal>
        {/* <Popover.Overlay /> */}
        <Popover.Content class="border border-white bg-black px-2.5 text-white">
          <Popover.Arrow />
          <Popover.Description>
            <Show
              when={measuring().x2 != undefined}
              fallback={
                <div style={{ "text-align": "center" }}>
                  Use the <IconOneKey class="w-4.5 fill-white" /> and{" "}
                  <IconTwoKey class="w-4.5 fill-white" /> keys
                  <br />
                  on your keyboard to place points
                </div>
              }
            >
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
              <p>
                Δtime=
                {formatTimeDelta((measuring().x2! - measuring().x1!) * 1000)}
              </p>
            </Show>
          </Popover.Description>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};

export default ToolMeasure;
