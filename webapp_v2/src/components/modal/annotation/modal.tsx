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
      console.log(currentAnnotation()!.label);
      setLabel(currentAnnotation()!.label);
      setNotes(currentAnnotation()!.notes);
      setTimestamp_ms(currentAnnotation()!.timestamp_ms);
    }
  });

  let closeRef: HTMLButtonElement;

  return (
    <Dialog>
      <Dialog.Trigger ref={props.ref} class="hidden"></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Label>
            <Show
              when={currentAnnotation()!.label == ""}
              fallback={"Edit Annotation"}
            >
              Create New Annotation
            </Show>
          </Dialog.Label>
          <div class="p-5">
            <p>Timestamp: {timestamp_ms()}</p>
            <div class="flex flex-row">
              <p>Label:</p>
              <input
                type="text"
                value={label()}
                oninput={(e) => {
                  setLabel(e.target.value);
                }}
              />
            </div>
            <div class="flex flex-row">
              <p>Note:</p>
              <input
                type="text"
                value={notes()}
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
                <Show when={!loading()} fallback={<div class="loader"></div>}>
                  <Show when={currentAnnotation()!.label != ""}>
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
                </Show>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default AnnotationModal;
