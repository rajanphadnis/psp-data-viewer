import { Component } from "solid-js";
import { getSharelink } from "../../../browser/sharelink";
import { StateType, useState } from "../../../state";
import IconRefresh from "../../icons/refresh";
import styles from "../../navbar/navbar.module.css";

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
    {
      addDataset,
      updateDataset,
      removeDataset,
      updateColor,
    },
  ] = useState() as StateType;

  return (
    <button
      class={styles.navbarButtons}
      onclick={async () => {
        setLoadingState({ isLoading: true, statusMessage: "Refreshing..." });
        const dbs = await window.indexedDB.databases();
        dbs.forEach(async (db) => {
          await window.indexedDB.deleteDatabase(db.name!);
        });
        const [link, b64] = getSharelink(activeDatasets(), plotRange().start, plotRange().end, datasetsLegendSide());
        window.location.href = link;
      }}
    >
      <IconRefresh />
    </button>
  );
};

export default RefreshListButton;
