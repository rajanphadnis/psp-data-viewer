import { Component, Show } from "solid-js";
import styles from "./navbar.module.css";
import layout from "../../layout.module.css";
import { useState } from "../../state";
import Dialog from "@corvu/dialog";
import TestSwitcherModal from "../modal/test_switcher/test_switcher";
import SwapIcon from "../icons/swap";
import SettingsIcon from "../icons/settings";
import SettingsModal from "../modal/settings/settings_panel";
import { getDateLabel } from "../../browser/util";
import { config } from "../../generated_app_info";

const NavBarTitle: Component<{ id: string; name: string; test_article: string; gse_article: string }> = (props) => {
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
    <div class={layout.flexRowStart} style="justify-content: start;">
      <Show
        when={testBasics() != undefined ? testBasics().id != "" : false}
        fallback={<div class={styles.title}>Loading...</div>}
      >
        <Dialog>
          <Dialog.Trigger class={styles.title}>
            {config.naming.page_title}:{testBasics().test_article}:{testBasics().gse_article}:
            {`${getDateLabel(testBasics().starting_timestamp!)}:${testBasics().name}`}
          </Dialog.Trigger>
          <TestSwitcherModal />
        </Dialog>
        <Dialog>
          <Dialog.Trigger title="Change Active Test" class={styles.navbarButtons}>
            <SwapIcon />
          </Dialog.Trigger>
          <TestSwitcherModal />
        </Dialog>
        <Dialog>
          <Dialog.Trigger title="Site Settings" class={styles.navbarButtons}>
            <SettingsIcon />
          </Dialog.Trigger>
          <SettingsModal />
        </Dialog>
      </Show>
    </div>
  );
};

export default NavBarTitle;
