import { Component } from "solid-js";
import { StateType, useState } from "../../../../state";
import { Preferences } from "../../../../types";
import StickyNoteIcon from "../../../icons/note_sticky";

const ToggleAnnotations: Component<{}> = (props) => {
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
    <button
      onclick={(e) => {
        setSitePreferences((oldPref) => {
          return {
            displayedSamples: oldPref.displayedSamples,
            axesSets: oldPref.axesSets,
            annotationWidth: oldPref.annotationWidth,
            annotationColor: oldPref.annotationColor,
            annotationHeight: oldPref.annotationHeight,
            annotationsEnabled: !oldPref.annotationsEnabled,
          } as Preferences;
        });
      }}
      class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25 text-xs font-bold text-black"
    >
      <div class="mr-1.25 p-1.25 pb-0.5">
        <StickyNoteIcon class="w-3.75 fill-black" />
      </div>
      <p class="m-0 text-xs font-bold text-black">
        {sitePreferences().annotationsEnabled ? "Disable" : "Enable"}{" "}
        Annotations
      </p>
    </button>
  );
};

export default ToggleAnnotations;
