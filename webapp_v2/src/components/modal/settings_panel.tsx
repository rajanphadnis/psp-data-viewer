import { Accessor, Component, For } from "solid-js";
import Dialog from "@corvu/dialog";
import "./modal.module.css";
import { useState } from "../../state";
import { TestBasics } from "../../types";
import TestEntry from "./test_button";
import styles from "./modal.module.css";
import AppInfo from "./app_info";
import SettingsButton from "./settings_button";
import IconRecycle from "../icons/recycle";
import IconRefresh from "../icons/refresh";
import IconCloudDownload from "../icons/cloud_download";
import IconEyeDrop from "../icons/eye_drop";
import IconFile from "../icons/file";
import IconAdmin from "../icons/admin";
import IconListCheck from "../icons/list_check";
import { getSharelink } from "../../browser/sharelink";

const SettingsModal: Component<{}> = (props) => {
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
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class={styles.settingsModal}>
        <Dialog.Label>Settings</Dialog.Label>
        <div class={styles.settingsModalDescription}>
          <div class={styles.settingsContentDiv}>
            <SettingsButton
              name="Refresh Metadata"
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
                  datasetsLegendSide()
                );
                window.location.href = link;
              }}
            >
              <IconCloudDownload />
            </SettingsButton>
            <SettingsButton
              name="Reset Site"
              onclick={async () => {
                setLoadingState({ isLoading: true, statusMessage: "Resetting..." });
                localStorage.clear();
                sessionStorage.clear();
                const dbs = await window.indexedDB.databases();
                dbs.forEach(async (db) => {
                  await window.indexedDB.deleteDatabase(db.name!);
                });
                const [link, b64] = getSharelink(
                  activeDatasets(),
                  plotRange().start,
                  plotRange().end,
                  datasetsLegendSide()
                );
                window.location.href = link;
              }}
            >
              <IconRefresh />
            </SettingsButton>
            <SettingsButton
              name="Measuring Tool Color"
              onclick={() => {
                console.log("Measuring Tool Color");
              }}
            >
              <IconEyeDrop />
            </SettingsButton>
            <SettingsButton
              name="Documentation"
              onclick={() => {
                window.open("https://psp-docs.rajanphadnis.com/", "_blank");
              }}
            >
              <IconFile />
            </SettingsButton>
            <SettingsButton
              name="Admin Console"
              onclick={() => {
                window.open("https://admin.pspl.space/", "_blank");
              }}
            >
              <IconAdmin />
            </SettingsButton>
            <SettingsButton
              name="Mission Management"
              onclick={() => {
                window.open("https://mission.pspl.space/", "_blank");
              }}
            >
              <IconListCheck />
            </SettingsButton>
          </div>
          <AppInfo />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default SettingsModal;
