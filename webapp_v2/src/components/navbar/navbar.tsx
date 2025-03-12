import { Component } from "solid-js";
import layout from "../../layout.module.css";
import { StateType, useState } from "../../state";
import styles from "./navbar.module.css";
import SharelinkButton from "./sharelink_button";
import Status from "./status";
import NavBarTitle from "./title";

const NavBar: Component<{}> = () => {
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
    <div class={styles.navBar}>
      <NavBarTitle
        name={testBasics().name}
        test_article={testBasics().test_article}
        id={testBasics().id}
        gse_article={testBasics().gse_article}
      />
      <div class={layout.flexRowEnd} style="justify-content: end;">
        <Status />
        <SharelinkButton />
      </div>
    </div>
  );
};

export default NavBar;
