import Dialog from "@corvu/dialog";
import { Component } from "solid-js";
import { StateType, useState } from "../../../state";
import Binoculars from "../../icons/binoculars";
import { LeftClickIcon, RightClickIcon } from "../../icons/click";
import CtrlKeyIcon from "../../icons/ctrl";
import ShiftIcon from "../../icons/shift";
import { TableCell } from "./table_helpers";
import { Tabs } from "./tabs";
import DropdownClosure from "./dropdown_closure";

const HelpModal: Component<{}> = (props) => {
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
    <Dialog>
      <Dialog.Trigger class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25 text-sm font-extrabold text-black font-stretch-expanded">
        <div class="mr-1.25 p-1.25 pb-0.5">
          <Binoculars class="w-3.75 fill-black" />
        </div>
        <p class="m-0 text-xs font-bold text-black">Guide</p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content class="bg-corvu-100 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10% fixed top-1/2 left-1/2 z-50 max-h-3/4 min-w-80 overflow-auto rounded-lg border-2 border-amber-400 px-0 py-0">
          <Dialog.Label>API Guide & Platform Help</Dialog.Label>
          <div class="flex h-full w-full flex-col p-3 text-white">
            <DropdownClosure
              title={
                <h2 class="mt-1 mb-0 pb-0 text-xl font-bold">
                  Keyboard shortcuts and hotkeys:
                </h2>
              }
            >
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="p-2 text-start">Command</th>
                    <th class="p-2 text-start">Action</th>
                    <th class="p-2 text-start">Notes</th>
                  </tr>
                </thead>
                <tbody class="striped">
                  <tr>
                    <TableCell>
                      <RightClickIcon class="relative inline-block w-5 fill-white align-middle" />{" "}
                      (Right Click)
                    </TableCell>
                    <TableCell>Create Annotation</TableCell>
                    <TableCell>Only works if annotations are enabled</TableCell>
                  </tr>
                  <tr>
                    <TableCell>
                      <ShiftIcon class="relative inline-block w-3 fill-white align-middle" />{" "}
                      {"(Shift) + "}
                      <LeftClickIcon class="relative inline-block w-5 fill-white align-middle" />{" "}
                      (Left Click)
                    </TableCell>
                    <TableCell>Create Annotation</TableCell>
                    <TableCell>Only works if annotations are enabled</TableCell>
                  </tr>
                  <tr>
                    <TableCell>
                      <ShiftIcon class="relative inline-block w-3 fill-white align-middle" />{" "}
                      {"(Shift) + "}
                      <RightClickIcon class="relative inline-block w-5 fill-white align-middle" />{" "}
                      (Right Click)
                    </TableCell>
                    <TableCell>Edit/Delete Annotations</TableCell>
                    <TableCell>Only works if annotations are enabled</TableCell>
                  </tr>
                  <tr>
                    <TableCell>
                      <CtrlKeyIcon class="relative inline-block w-3 fill-white align-middle" />{" "}
                      {"(Ctrl) + "}
                      <LeftClickIcon class="relative inline-block w-5 fill-white align-middle" />{" "}
                      (Left Click)
                    </TableCell>
                    <TableCell>Place/Clear Measurement Points</TableCell>
                    <TableCell>
                      Cycles through: set point 1, set point 2, clear points
                    </TableCell>
                  </tr>
                </tbody>
              </table>
            </DropdownClosure>

            <DropdownClosure
              title={
                <h2 class="mt-5 mb-0 pb-0 text-xl font-bold">
                  Access what you currently see using the API:
                </h2>
              }
            >
              <Tabs />
            </DropdownClosure>
            {/* <h2 class="mt-5 mb-0 pb-0 text-xl font-bold">
              Access what you currently see using the API:
            </h2> */}

            <Dialog.Close class="w-fit cursor-pointer rounded-md bg-amber-400 px-3 py-2 font-bold text-black hover:bg-amber-200">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default HelpModal;
