import Dialog from "@corvu/dialog";
import { Component } from "solid-js";
import { StateType, useState } from "../../../state";
import {
  IconGalacticRepublic,
  IconGalacticSenate,
  IconJedi,
  IconJediOrder,
  IconOldRepublic,
  IconSpock,
} from "../../icons/easter";
import PlottingOptionsModal from "../settings/plotting_options";
import EasterAudioButton from "./audio_button";
import EasterClickButton from "./click_button";

const EasterEggModal: Component<{}> = (props) => {
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
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class="h-1/2">
        <Dialog.Label>Join an Order</Dialog.Label>
        <div class="scrollbar-white m-0 flex h-[calc(100%-4.25rem)] flex-col items-start justify-between overflow-auto">
          <div class="flex w-full flex-row flex-wrap items-center justify-evenly">
            <EasterClickButton name="Star Trek">
              <IconSpock class="w-3.75 fill-black" />
            </EasterClickButton>
            <EasterAudioButton name="Jedi">
              <IconJedi class="w-3.75 fill-black" />
            </EasterAudioButton>
            <PlottingOptionsModal name="Jedi Order">
              <IconJediOrder class="w-3.75 fill-black" />
            </PlottingOptionsModal>
            <EasterButton name="Galactic Senate" onclick={() => {}}>
              <IconGalacticSenate class="w-3.75 fill-black" />
            </EasterButton>
            <EasterButton name="Old Republic" onclick={() => {}}>
              <IconOldRepublic class="w-3.75 fill-black" />
            </EasterButton>
            <EasterButton name="Galactic Republic" onclick={() => {}}>
              <IconGalacticRepublic class="w-3.75 fill-black" />
            </EasterButton>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default EasterEggModal;

const EasterButton: Component<{
  children?: any;
  name: string;
  onclick: () => void;
}> = (props) => {
  return (
    <button
      class="bg-rush hover:bg-rush-light m-5 flex h-26 w-40 cursor-pointer flex-col items-center justify-evenly border-none text-center text-black"
      onclick={() => {
        props.onclick();
      }}
    >
      <p class="mt-0 font-bold">{props.name}</p>
      {props.children}
    </button>
  );
};
