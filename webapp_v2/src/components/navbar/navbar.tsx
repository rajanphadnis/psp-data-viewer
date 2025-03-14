import { Component } from "solid-js";
import { StateType, useState } from "../../state";
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
    currentAnnotation,
    setCurrentAnnotation,
    {
      addDataset,
      updateDataset,
      removeDataset,
      updateColor,
    },
  ] = useState() as StateType;
  return (
    <div class="px-4 pt-2 pb-0 flex flex-row items-center justify-between">
      <NavBarTitle
        name={testBasics().name}
        test_article={testBasics().test_article}
        id={testBasics().id}
        gse_article={testBasics().gse_article}
      />
      <div class="flex flex-row items-center justify-end">
        <Status />
        <SharelinkButton />
      </div>
    </div>
  );
};

export default NavBar;
