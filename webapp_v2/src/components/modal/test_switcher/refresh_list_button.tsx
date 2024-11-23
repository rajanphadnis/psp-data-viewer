import { Component } from "solid-js";
import styles from "../../navbar/navbar.module.css";
import IconRefresh from "../../icons/refresh";
import { useState } from "../../../state";
import { getSharelink } from "../../../browser/sharelink";

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
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();

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
