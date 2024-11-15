import { Component } from "solid-js";
import styles from "./navbar.module.css";
import layout from "../../layout.module.css";
import NavBarTitle from "./title";
import Status from "./status";
import SharelinkButton from "./sharelink_button";
import { useState } from "../../state";

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
    { addDataset, updateDataset, removeDataset, updateColor },
  ]: any = useState();
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
