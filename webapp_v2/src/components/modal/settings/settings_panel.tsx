import Dialog from "@corvu/dialog";
import { Component } from "solid-js";
import { getSharelink } from "../../../browser/sharelink";
import { config } from "../../../generated_app_info";
import { StateType, useState } from "../../../state";
import IconAdmin from "../../icons/admin";
import IconCloudDownload from "../../icons/cloud_download";
import IconFile from "../../icons/file";
import IconListCheck from "../../icons/list_check";
import IconRefresh from "../../icons/refresh";
import SettingsIcon from "../../icons/settings";
import AppInfo from "./app_info";
import PlottingOptionsModal from "./plotting_options";
import SettingsButton from "./settings_button";

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
    annotations,
    setAnnotations,
    currentAnnotation,
    setCurrentAnnotation,
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;

  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content class="h-1/2">
        <Dialog.Label>Settings</Dialog.Label>
        <div class="scrollbar-white m-0 flex h-[calc(100%-4.25rem)] flex-col items-start justify-between overflow-auto">
          <div class="flex w-full flex-row flex-wrap items-center justify-evenly">
            <SettingsButton
              name="Refresh Metadata"
              onclick={async () => {
                setLoadingState({
                  isLoading: true,
                  statusMessage: "Refreshing...",
                });
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
              <IconCloudDownload class="w-6 fill-black" />
            </SettingsButton>
            <SettingsButton
              name="Reset Site"
              onclick={async () => {
                setLoadingState({
                  isLoading: true,
                  statusMessage: "Resetting...",
                });
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
                  datasetsLegendSide(),
                );
                window.location.href = link;
              }}
            >
              <IconRefresh class="w-6 fill-black" />
            </SettingsButton>
            <PlottingOptionsModal name="Plotting Options">
              <SettingsIcon class="w-6 fill-black" />
            </PlottingOptionsModal>
            {/* <SettingsButton
              name="Plotting Options"
              onclick={() => {
                console.log("Plotting Options");
              }}
            >
              <SettingsIcon />
            </SettingsButton> */}
            <SettingsButton
              name="Documentation"
              onclick={() => {
                window.open(config.urls.docs_url, "_blank");
              }}
            >
              <IconFile class="w-5 fill-black" />
            </SettingsButton>
            <SettingsButton
              name="Admin Console"
              onclick={() => {
                window.open(config.urls.admin_dashboard_url, "_blank");
              }}
            >
              <IconAdmin class="w-6 fill-black" />
            </SettingsButton>
            <SettingsButton
              name="Mission Management"
              onclick={() => {
                window.open("https://mission.pspl.space/", "_blank");
              }}
            >
              <IconListCheck class="w-5 fill-black" />
            </SettingsButton>
          </div>
          <AppInfo />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default SettingsModal;
