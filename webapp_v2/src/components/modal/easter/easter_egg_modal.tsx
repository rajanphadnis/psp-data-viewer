import { Component } from "solid-js";
import { useState } from "../../../state";
import Dialog from "@corvu/dialog";
import styles from "../modal.module.css";
import {
  IconSpock,
  IconJedi,
  IconOldRepublic,
  IconJediOrder,
  IconGalacticSenate,
  IconGalacticRepublic,
} from "../../icons/easter";
import EasterAudioButton from "./audio_button";
import EasterClickButton from "./click_button";
import PlottingOptionsModal from "../settings/plotting_options";

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
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();

  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class={styles.settingsModal}>
        <Dialog.Label>Join an Order</Dialog.Label>
        <div class={styles.settingsModalDescription}>
          <div class={styles.settingsContentDiv}>
            <EasterClickButton name="Star Trek">
              <IconSpock />
            </EasterClickButton>
            <EasterAudioButton name="Jedi">
              <IconJedi />
            </EasterAudioButton>
            <PlottingOptionsModal name="Jedi Order">
              <IconJediOrder />
            </PlottingOptionsModal>
            <EasterButton name="Galactic Senate" onclick={() => {}}>
              <IconGalacticSenate />
            </EasterButton>
            <EasterButton name="Old Republic" onclick={() => {}}>
              <IconOldRepublic />
            </EasterButton>
            <EasterButton name="Galactic Republic" onclick={() => {}}>
              <IconGalacticRepublic />
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
      class={`${styles.settingsButtonEaster} ${styles.settingsButton}`}
      onclick={() => {
        props.onclick();
      }}
    >
      <p class={styles.settingsButtonName}>{props.name}</p>
      {props.children}
    </button>
  );
};
