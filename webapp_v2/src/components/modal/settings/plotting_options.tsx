import Dialog from "@corvu/dialog";
import { Component, createSignal, Show } from "solid-js";
import { getSharelink } from "../../../browser/sharelink";
import { StateType, useState } from "../../../state";
import { MeasureData, Preferences } from "../../../types";
import SettingsColorPicker from "../easter/color_picker";

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
    currentAnnotation,
    setCurrentAnnotation,
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;

  const [axesSets, setaxesSets] = createSignal<number>(
    sitePreferences().axesSets / 2,
  );
  const [plotPoints, setplotPoints] = createSignal<number>(
    sitePreferences().displayedSamples,
  );
  const [pointColor, setpointColor] = createSignal<string>(
    measuring().toolColor,
  );
  const [annotationWidth, setAnnotationWidth] = createSignal(
    sitePreferences().annotationWidth,
  );
  const [annotationColor, setAnnotationColor] = createSignal(
    sitePreferences().annotationColor,
  );
  const [annotationHeight, setAnnotationHeight] = createSignal(
    sitePreferences().annotationHeight,
  );
  const [annotationsEnabled, setAnnotationsEnabled] = createSignal(
    sitePreferences().annotationsEnabled,
  );

  return (
    <Dialog>
      <Dialog.Trigger
        title="Plotting Options"
        class="bg-rush hover:bg-rush-light m-5 flex h-26 w-40 cursor-pointer flex-col items-center justify-evenly border-none text-center text-black"
      >
        <p class="mt-0 font-bold">{props.name}</p>
        {props.children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content class="h-2/5">
          <Dialog.Label>Plotting Options</Dialog.Label>
          <div class="scrollbar-white m-0 flex h-[calc(100%-4.25rem)] flex-col items-start justify-start overflow-auto">
            <div class="my-3 flex flex-row items-center justify-start">
              <p class="mx-2.5">Axes Sets:</p>
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
              <p class="mx-2.5">
                {sitePreferences().axesSets / 2 != axesSets()
                  ? `${sitePreferences().axesSets / 2} --> `
                  : ""}
                {axesSets()}
              </p>
            </div>
            <div class="mb-3 flex flex-row items-center justify-start">
              <p class="mx-2.5">Displayed Samples:</p>
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
              <p class="mx-2.5">
                {sitePreferences().displayedSamples != plotPoints()
                  ? `${sitePreferences().displayedSamples} --> `
                  : ""}
                {plotPoints()}
              </p>
            </div>
            <div class="mb-3 flex flex-row items-center justify-start">
              <p class="mx-2.5">Measuring Tool Color:</p>
              <SettingsColorPicker
                color={pointColor}
                setColor={setpointColor}
              />
              <p class="mx-2.5">
                {measuring().toolColor != pointColor()
                  ? `${measuring().toolColor} --> `
                  : ""}
                {pointColor()}
              </p>
            </div>
            <div class="mb-3 flex flex-row items-center justify-start">
              <p class="mx-2.5">
                Annotation Width:
              </p>
              <input
                type="range"
                min="1"
                max="5"
                value={annotationWidth()}
                step="1"
                on:input={(e) => {
                  setAnnotationWidth(parseInt(e.target.value));
                }}
              />
              <p class="mx-2.5">
                {sitePreferences().annotationWidth != annotationWidth()
                  ? `${sitePreferences().annotationWidth} --> `
                  : ""}
                {annotationWidth()}
              </p>
            </div>
            <div class="mb-3 flex flex-row items-center justify-start">
              <p class="mx-2.5">Annotation Color:</p>
              <SettingsColorPicker
                color={annotationColor}
                setColor={setAnnotationColor}
              />
              <p class="mx-2.5">
                {sitePreferences().annotationColor != annotationColor()
                  ? `${sitePreferences().annotationColor} --> `
                  : ""}
                {annotationColor()}
              </p>
            </div>
            <div class="mb-3 flex flex-row items-center justify-start">
              <p class="mx-2.5">Annotation Position above plot:</p>
              <input
                type="range"
                min="0"
                max="5"
                value={annotationHeight()}
                step="1"
                on:input={(e) => {
                  setAnnotationHeight(parseInt(e.target.value));
                }}
              />
              <p class="mx-2.5">
                {sitePreferences().annotationHeight != annotationHeight()
                  ? `${sitePreferences().annotationHeight} --> `
                  : ""}
                {annotationHeight()}
              </p>
            </div>
            <Show
              when={
                sitePreferences().axesSets / 2 != axesSets() ||
                sitePreferences().displayedSamples != plotPoints() ||
                (measuring() as MeasureData).toolColor != pointColor() ||
                sitePreferences().annotationColor != annotationColor() ||
                sitePreferences().annotationWidth != annotationWidth() ||
                sitePreferences().annotationHeight != annotationHeight()
              }
            >
              <button
                class="bg-rush hover:bg-rush-light m-2.5 w-[calc(100%-20px)] cursor-pointer border-none p-3.75 text-center font-bold text-black"
                on:click={() => {
                  setAppReadyState(false);
                  const new_pref: Preferences = {
                    displayedSamples: plotPoints(),
                    axesSets: parseInt((axesSets() * 2).toString()),
                    annotationWidth: annotationWidth(),
                    annotationColor: annotationColor(),
                    annotationHeight: annotationHeight(),
                    annotationsEnabled: annotationsEnabled(),
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
                  const [link, b64] = getSharelink(
                    activeDatasets(),
                    plotRange().start,
                    plotRange().end,
                    datasetsLegendSide(),
                  );
                  window.location.href = link;
                  // location.reload();
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
