import Dialog from "@corvu/dialog";
import { Component, Show } from "solid-js";
import { getDateLabel } from "../../browser/util";
import { config } from "../../generated_app_info";
import { StateType, useState } from "../../state";
import SettingsIcon from "../icons/settings";
import SwapIcon from "../icons/swap";
import SettingsModal from "../modal/settings/settings_panel";
import TestSwitcherModal from "../modal/test_switcher/test_switcher";

const NavBarTitle: Component<{
  id: string;
  name: string;
  test_article: string;
  gse_article: string;
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
  return (
    <div class="flex flex-row items-center justify-start">
      <Show
        when={testBasics() != undefined ? testBasics().id != "" : false}
        fallback={
          <div class="cursor-pointer border-none bg-transparent text-xl font-bold text-white">
            Loading...
          </div>
        }
      >
        <Dialog>
          <Dialog.Trigger class="cursor-pointer border-none bg-transparent text-xl font-bold text-white">
            {config.naming.page_title}:{testBasics().test_article}:
            {testBasics().gse_article}:
            {`${getDateLabel(testBasics().starting_timestamp!)}:${testBasics().name}`}
          </Dialog.Trigger>
          <TestSwitcherModal />
        </Dialog>
        <Dialog>
          <Dialog.Trigger
            title="Change Active Test"
            class="bg-rush hover:bg-rush-light ml-5 cursor-pointer border-0 pt-0 text-center text-lg font-bold text-black"
          >
            <SwapIcon class="w-7 fill-black p-2" />
          </Dialog.Trigger>
          <TestSwitcherModal />
        </Dialog>
        <Dialog>
          <Dialog.Trigger
            title="Site Settings"
            class="text-md bg-rush hover:bg-rush-light ml-5 cursor-pointer border-0 text-center font-bold text-black"
          >
            <SettingsIcon class="w-7 fill-black p-2" />
          </Dialog.Trigger>
          <SettingsModal />
        </Dialog>
      </Show>
    </div>
  );
};

export default NavBarTitle;
