import Dialog from "@corvu/dialog";
import { Component, createSignal } from "solid-js";
import { delay } from "../../../browser/util";
import { StateType, useState } from "../../../state";
import IconCopy from "../../icons/copy";
import IconCSV from "../../icons/csv";
import IconDownload from "../../icons/download";
import DataExportTypeButton from "./export_type_button";
import TwoOptionExportButton from "./two_option_button";
import { plotSnapshot } from "../../../browser/image_tools";
import { downloadCSV } from "../../../browser/csv";

const DataExportModal: Component<{}> = (props) => {
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

  const [exportCurrentTime, setExportCurrentTime] = createSignal(true);
  const [exportCurrentChannels, setExportCurrentChannels] = createSignal(true);

  let closeRef: HTMLButtonElement;

  return (
    <Dialog>
      <Dialog.Trigger class="hover:bg-rush-light bg-rush mb-1.25 flex w-1/10 cursor-pointer flex-row items-center justify-center border-none p-1.25 text-sm font-extrabold text-black font-stretch-expanded">
        ⁝
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content class="bg-corvu-100 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10% fixed top-1/2 left-1/2 z-50 min-w-80 rounded-lg border-2 border-amber-400 px-0 py-0">
          <Dialog.Label>Export Data</Dialog.Label>
          <div class="flex w-full flex-col p-3 text-white">
            <div class="mb-3 flex flex-row items-center justify-between">
              <TwoOptionExportButton
                val={exportCurrentTime}
                set={setExportCurrentTime}
                trueVal="Currently Displayed Time"
                falseVal="All Time"
              />
              <p>{"->"}</p>
              <TwoOptionExportButton
                val={exportCurrentChannels}
                set={setExportCurrentChannels}
                trueVal="Selected Channels"
                falseVal="All Channels"
              />
              <p>{"->"}</p>
              <div class="flex h-54 w-1/3 min-w-60 flex-col">
                <DataExportTypeButton
                  icon={<IconCopy class="w-3.75 fill-black" />}
                  name="Copy PNG to Clipboard"
                  exportHandler={async (d, s, e) => {
                    plotSnapshot("copy");
                    return true;
                  }}
                  exportCurrentTime={exportCurrentTime}
                  exportCurrentChannels={exportCurrentChannels}
                  available={true}
                />
                <DataExportTypeButton
                  icon={<IconCopy class="w-3.75 fill-black" />}
                  name="Copy SVG to Clipboard"
                  exportHandler={async (d, s, e) => {
                    alert("Feature not available (still under development)");
                    return false;
                  }}
                  exportCurrentTime={exportCurrentTime}
                  exportCurrentChannels={exportCurrentChannels}
                  available={false}
                />
                <DataExportTypeButton
                  icon={<IconDownload class="w-3.75 fill-black" />}
                  name="Download PNG"
                  exportHandler={async (d, s, e) => {
                    plotSnapshot("download");
                    return true;
                  }}
                  exportCurrentTime={exportCurrentTime}
                  exportCurrentChannels={exportCurrentChannels}
                  available={true}
                />
                <DataExportTypeButton
                  icon={<IconCopy class="w-3.75 fill-black" />}
                  name="Download SVG"
                  exportHandler={async (d, s, e) => {
                    alert("Feature not available (still under development)");
                    return false;
                  }}
                  exportCurrentTime={exportCurrentTime}
                  exportCurrentChannels={exportCurrentChannels}
                  available={false}
                />
                <DataExportTypeButton
                  icon={<IconCSV class="w-3.75 fill-black" />}
                  name="Download CSV"
                  exportHandler={async (d, s, e) => {
                    downloadCSV(d, s, e);
                    return true;
                  }}
                  exportCurrentTime={exportCurrentTime}
                  exportCurrentChannels={exportCurrentChannels}
                  available={true}
                />
                <DataExportTypeButton
                  icon={<IconCopy class="w-3.75 fill-black" />}
                  name="Download Animation"
                  exportHandler={async (d, s, e) => {
                    alert("Feature not available (still under development)");
                    return false;
                  }}
                  exportCurrentTime={exportCurrentTime}
                  exportCurrentChannels={exportCurrentChannels}
                  available={false}
                />
              </div>
            </div>
            {/* <Dialog.Close
              ref={closeRef!}
              class="cursor-pointer rounded-md bg-amber-400 px-3 py-2 font-bold text-black hover:bg-amber-200 w-fit"
            >
              Close
            </Dialog.Close> */}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default DataExportModal;
