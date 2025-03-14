import Dialog from "@corvu/dialog";
import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { useState, StateType } from "../../../state";
import { Annotation } from "../../../types";
import {
  delete_annotation_db,
  set_annotation,
} from "../../../db/db_interaction";

const AnnotationModal: Component<{ ref: any }> = (props) => {
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

  const [label, setLabel] = createSignal("");
  const [notes, setNotes] = createSignal("");
  const [timestamp_ms, setTimestamp_ms] = createSignal(0);
  const [loading, setLoading] = createSignal(false);

  createEffect(() => {
    if (currentAnnotation()) {
      console.log(currentAnnotation());
      setLabel(currentAnnotation()!.label);
      setNotes(currentAnnotation()!.notes);
      setTimestamp_ms(currentAnnotation()!.timestamp_ms);
    }
  });

  let closeRef: HTMLButtonElement;

  return (
    <Dialog>
      <Dialog.Trigger
        ref={props.ref}
        class="bg-corvu-100 hover:bg-corvu-200 slide-in-from-top-2 my-auto hidden rounded-lg px-4 py-3 text-lg font-medium transition-all duration-100 active:translate-y-0.5"
      >
        Open Dialog
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content class="bg-corvu-100 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10% fixed top-1/2 left-1/2 z-50 min-w-80 rounded-lg border-2 border-amber-400 px-0 py-0">
          <Dialog.Label>
            <Show
              when={
                currentAnnotation() != undefined
                  ? currentAnnotation()!.label == ""
                  : false
              }
              fallback={"Edit Annotation"}
            >
              Create New Annotation
            </Show>
          </Dialog.Label>
          <div class="flex flex-col p-3">
            <p class="mb-2">Timestamp: {timestamp_ms()}</p>
            <div class="mb-2 flex flex-row items-center">
              <p>Label:</p>
              <input
                type="text"
                value={label()}
                class="bg-bg border-rush-light focus:border-aged w-80 border-2 p-0 text-white outline-none focus:outline-hidden disabled:border-0 disabled:bg-transparent"
                oninput={(e) => {
                  setLabel(e.target.value);
                }}
              />
            </div>
            <div class="mb-2 flex flex-row items-center">
              <p>Note:</p>
              <input
                type="text"
                value={notes()}
                class="bg-bg border-rush-light focus:border-aged w-80 border-2 p-0 text-white outline-none focus:outline-hidden disabled:border-0 disabled:bg-transparent"
                oninput={(e) => {
                  setNotes(e.target.value);
                }}
              />
            </div>
            <div class="mt-3 flex justify-between">
              <Dialog.Close
                ref={closeRef!}
                class="cursor-pointer rounded-md bg-amber-400 px-3 py-2 font-bold text-black hover:bg-amber-200"
              >
                Cancel
              </Dialog.Close>
              <div class="flex flex-row">
                {/* <Show when={!loading()} fallback={<div class="loader"></div>}> */}
                <Show
                  when={
                    currentAnnotation() != undefined
                      ? currentAnnotation()!.label != ""
                      : false
                  }
                >
                  <button
                    class="mr-2 cursor-pointer rounded-md bg-red-600 px-3 py-2 font-bold hover:bg-red-400"
                    onclick={async (e) => {
                      setLoading(true);
                      await delete_annotation_db(
                        timestamp_ms(),
                        testBasics().id,
                        setLoadingState,
                      );
                      closeRef!.click();
                      setLoading(false);
                    }}
                  >
                    Delete
                  </button>
                </Show>
                <button
                  class="cursor-pointer rounded-md bg-amber-400 px-3 py-2 font-bold text-black hover:bg-amber-200"
                  onclick={async (e) => {
                    setLoading(true);
                    await set_annotation(
                      {
                        label: label(),
                        notes: notes(),
                        timestamp_ms: timestamp_ms(),
                      } as Annotation,
                      testBasics().id,
                      setLoadingState,
                    );
                    closeRef!.click();
                    setLoading(false);
                  }}
                >
                  Save
                </button>
                {/* </Show> */}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
    // <Dialog
    //   onOpenChange={(e) => {
    //     console.log(e);
    //   }}
    // >
    //   <Dialog.Trigger ref={props.ref} class="hidden"></Dialog.Trigger>
    //   <Dialog.Portal>
    //     <Dialog.Overlay />
    //     <Dialog.Content>
    //       <Dialog.Label>
    //         <Show
    //           when={
    //             // currentAnnotation() != undefined
    //             //   ?
    //             currentAnnotation()?.label != ""
    //             //   : false
    //             // false
    //           }
    //           fallback={"Edit Annotation"}
    //         >
    //           Create New Annotation
    //         </Show>
    //       </Dialog.Label>
    //       <div class="p-5">
    //         <p>Timestamp: {timestamp_ms()}</p>
    //         <div class="flex flex-row">
    //           <p>Label:</p>
    //           <input
    //             type="text"
    //             value={label()}
    //             oninput={(e) => {
    //               setLabel(e.target.value);
    //             }}
    //           />
    //         </div>
    //         <div class="flex flex-row">
    //           <p>Note:</p>
    //           <input
    //             type="text"
    //             value={notes()}
    //             oninput={(e) => {
    //               setNotes(e.target.value);
    //             }}
    //           />
    //         </div>
    //         <div class="mt-3 flex justify-between">
    //           <Dialog.Close
    //             // ref={closeRef!}
    //             class="cursor-pointer rounded-md bg-amber-400 px-3 py-2 font-bold text-black hover:bg-amber-200"
    //           >
    //             Cancel
    //           </Dialog.Close>
    //           <div class="flex flex-row">
    //             {/* <Show when={!loading()} fallback={<div class="loader"></div>}> */}
    //               {/* <Show
    //                 when={
    //                   currentAnnotation() != undefined
    //                     ? currentAnnotation()!.label != ""
    //                     : false
    //                 }
    //               >
    //                 <button
    //                   class="mr-2 cursor-pointer rounded-md bg-red-600 px-3 py-2 font-bold hover:bg-red-400"
    //                   onclick={async (e) => {
    //                     // setLoading(true);
    //                     await delete_annotation_db(
    //                       timestamp_ms(),
    //                       testBasics().id,
    //                       setLoadingState,
    //                     );
    //                     closeRef!.click();
    //                     // setLoading(false);
    //                   }}
    //                 >
    //                   Delete
    //                 </button>
    //               </Show> */}
    //               <button
    //                 class="cursor-pointer rounded-md bg-amber-400 px-3 py-2 font-bold text-black hover:bg-amber-200"
    //                 onclick={async (e) => {
    //                 //   setLoading(true);
    //                   await set_annotation(
    //                     {
    //                       label: label(),
    //                       notes: notes(),
    //                       timestamp_ms: timestamp_ms(),
    //                     } as Annotation,
    //                     testBasics().id,
    //                     setLoadingState,
    //                   );
    //                   closeRef!.click();
    //                 //   setLoading(false);
    //                 }}
    //               >
    //                 Save
    //               </button>
    //             {/* </Show> */}
    //           </div>
    //         </div>
    //       </div>
    //     </Dialog.Content>
    //   </Dialog.Portal>
    // </Dialog>
  );
};

export default AnnotationModal;
