import Dialog from "@corvu/dialog";
import { Component, createSignal, Show } from "solid-js";
import { StateType, useState } from "../../../state";
import { MeasureData, Preferences } from "../../../types";
import SettingsColorPicker from "../easter/color_picker";
import styles from "../modal.module.css";

const PlottingOptionsModal: Component<{
  children?: any;
  name: string;
}> = (props) => {
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

  const [axesSets, setaxesSets] = createSignal<number>((sitePreferences() as Preferences).axesSets / 2);
  const [plotPoints, setplotPoints] = createSignal<number>((sitePreferences() as Preferences).displayedSamples);
  const [pointColor, setpointColor] = createSignal<string>((measuring() as MeasureData).toolColor);

  return (
    <Dialog>
      <Dialog.Trigger title="Plotting Options" class={styles.settingsButton}>
        <p class={styles.settingsButtonName}>{props.name}</p>
        {props.children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content class={styles.easterModal}>
          <Dialog.Label>Plotting Options</Dialog.Label>
          <div class={styles.switcherModalDescription}>
            <div class={styles.optionsDiv}>
              <p>Axes Sets:</p>
              <input
                type="range"
                min="1"
                max="6"
                value={axesSets()}
                step="1"
                on:input={(e) => {
                  setaxesSets(parseInt(e.target.value));
                }}
              />
              <p>
                {(sitePreferences() as Preferences).axesSets / 2 != axesSets()
                  ? `${(sitePreferences() as Preferences).axesSets / 2} --> `
                  : ""}
                {axesSets()}
              </p>
            </div>
            <div class={styles.optionsDiv}>
              <p>Displayed Samples:</p>
              <input
                type="range"
                min="100"
                max="6000"
                value={plotPoints()}
                step="100"
                on:input={(e) => {
                  setplotPoints(parseInt(e.target.value));
                }}
              />
              <p>
                {(sitePreferences() as Preferences).displayedSamples != plotPoints()
                  ? `${(sitePreferences() as Preferences).displayedSamples} --> `
                  : ""}
                {plotPoints()}
              </p>
            </div>
            <div class={styles.optionsDiv}>
              <p>Measuring Tool Color:</p>
              <SettingsColorPicker color={pointColor} setColor={setpointColor} />
              <p>
                {(measuring() as MeasureData).toolColor != pointColor()
                  ? `${(measuring() as MeasureData).toolColor} --> `
                  : ""}
                {pointColor()}
              </p>
            </div>
            <Show
              when={
                (sitePreferences() as Preferences).axesSets / 2 != axesSets() ||
                (sitePreferences() as Preferences).displayedSamples != plotPoints() ||
                (measuring() as MeasureData).toolColor != pointColor()
              }
            >
              <button
                class={styles.optionsButton}
                on:click={() => {
                  setAppReadyState(false);
                  const new_pref: Preferences = {
                    displayedSamples: plotPoints(),
                    axesSets: parseInt((axesSets() * 2).toString()),
                  };
                  const new_measuring: MeasureData = {
                    x1: (measuring() as MeasureData).x1,
                    x2: (measuring() as MeasureData).x2,
                    y1: (measuring() as MeasureData).y1,
                    y2: (measuring() as MeasureData).y2,
                    toolColor: pointColor(),
                  };
                  setMeasuring(new_measuring);
                  setSitePreferences(new_pref);
                  setAppReadyState(true);
                  location.reload();
                }}
              >
                Save Changes
              </button>
            </Show>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default PlottingOptionsModal;
