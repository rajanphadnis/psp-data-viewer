import { HexColorPicker } from "solid-colorful";
import { Component, createSignal, Show } from "solid-js";
import useClickOutside from "../../../../browser/click_outside";
import { StateType, useState } from "../../../../state";

const ColorPicker: Component<{ dataset_id: string }> = (props) => {
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
  const [isOpen, toggle] = createSignal<boolean>(false);
  const [color, setColor] = createSignal<string>(
    plotPalletteColors()[
      activeDatasets().indexOf(props.dataset_id) % plotPalletteColors().length
    ],
  );
  const [target, setTarget] = createSignal<HTMLElement | undefined>();

  useClickOutside(target, () => {
    toggle((b) => {
      if (b) {
        updateColor(props.dataset_id, color());
      }
      return false;
    });
    // console.log("clicked outside");
  });

  return (
    <div ref={setTarget}>
      <div
        class="mr-1.5 h-6 w-6 cursor-pointer border-none"
        style={{ "background-color": color() }}
        onClick={() =>
          toggle((b) => {
            updateColor(props.dataset_id, color());
            return !b;
          })
        }
      />
      <Show when={isOpen()}>
        <div class="absolute z-99 rounded-lg shadow-lg">
          <HexColorPicker color={color()} onChange={setColor} />
        </div>
      </Show>
    </div>
  );
};

export default ColorPicker;
