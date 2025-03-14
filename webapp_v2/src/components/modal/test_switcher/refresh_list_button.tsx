import { Component } from "solid-js";
import { getSharelink } from "../../../browser/sharelink";
import { StateType, useState } from "../../../state";
import IconRefresh from "../../icons/refresh";

const RefreshListButton: Component<{}> = (props) => {
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
      class="ml-5 cursor-pointer border-0 pt-1 font-bold text-black text-center text-md bg-rush hover:bg-rush-light"
      onclick={async () => {
        setLoadingState({ isLoading: true, statusMessage: "Refreshing..." });
        const dbs = await window.indexedDB.databases();
        dbs.forEach(async (db) => {
          await window.indexedDB.deleteDatabase(db.name!);
        });
        const [link, b64] = getSharelink(
          activeDatasets(),
          plotRange().start,
          plotRange().end,
          datasetsLegendSide(),
        );
        window.location.href = link;
      }}
    >
      <IconRefresh />
    </button>
  );
};

export default RefreshListButton;
