import { Accessor, Component, createEffect, createMemo, createSignal, For, Setter, Show } from "solid-js";
import { useState } from "../../../state";
import styles from "./edit.module.css";
import Resizable from "@corvu/resizable";
import { EditorEntry } from "../../home/editor/editor_entry";
import SectionTitle from "../../title";
import UploadCreateButton from "./add_file_button";
import NewUploadComponent from "./upload_component";
import { createFileUploader } from "@solid-primitives/upload";
import { new_upload_hdf5, new_upload_tdsm_csv } from "../../../db/new";

const UploadEditLayout: Component<{
  name: Accessor<string>;
  testArticle: Accessor<string>;
  gseArticle: Accessor<string>;
  filePaths: Accessor<File[]>;
  setFilePaths: Setter<File[]>;
  isHDF5: Accessor<boolean>;
  setisFinalizing: Setter<boolean>;
  setName: Setter<string>;
  setTestArticle: Setter<string>;
  setGseArticle: Setter<string>;
  setIsHDF5: Setter<boolean>;
  tdmsDelay: Accessor<number>;
  setTdmsDelay: Setter<string>;
}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
  ]: any = useState();
  // const [files, setFiles] = createSignal<UploadFile[]>([]);
  const {
    files: tdmsFiles,
    selectFiles: selectTDMSFiles,
    removeFile: removeTDMSFile,
  } = createFileUploader({
    multiple: true,
    accept: ".csv,.tdms",
  });

  const {
    files: hdf5Files,
    selectFiles: selectHDF5Files,
    removeFile: removeHDF5File,
  } = createFileUploader({
    multiple: true,
    accept: ".hdf5",
  });

  const files = createMemo(() => {
    if (props.isHDF5()) {
      return hdf5Files();
    } else {
      return tdmsFiles();
    }
  });

  createEffect(() => {
    const toReturnTDMS = tdmsFiles().map((val) => val.file);
    const toReturnHDF5 = hdf5Files().map((val) => val.file);
    if (props.isHDF5()) {
      props.setFilePaths(toReturnHDF5);
    } else {
      props.setFilePaths(toReturnTDMS);
    }
  });

  return (
    <Resizable>
      <Resizable.Panel initialSize={0.5} minSize={0.4} class={`${styles.panel} ${styles.panelPadding}`}>
        <div class={styles.editDiv}>
          <div style={{ width: "100%" }}>
            <SectionTitle title="Create Test:" />
            <EditorEntry testData={props.name()} name="Test Name" input={true} setter={props.setName} />
            <EditorEntry
              testData={props.testArticle()}
              name="Test Article"
              input={true}
              setter={props.setTestArticle}
            />
            <EditorEntry testData={props.gseArticle()} name="GSE Article" input={true} setter={props.setGseArticle} />
            <div style={{ width: "100%", display: "flex", "flex-direction": "row", margin: "0px" }}>
              <button
                class={`${styles.fileTypeButton} ${
                  props.isHDF5() ? styles.inactiveFileTypeButton : styles.activeFileTypeButton
                }`}
                on:click={() => {
                  props.setIsHDF5(false);
                }}
              >
                TDMS + CSV
              </button>
              <button
                class={`${styles.fileTypeButton} ${
                  props.isHDF5() ? styles.activeFileTypeButton : styles.inactiveFileTypeButton
                }`}
                on:click={() => {
                  props.setIsHDF5(true);
                }}
              >
                HDF5
              </button>
            </div>
            <Show when={!props.isHDF5()}>
              <EditorEntry testData={props.tdmsDelay()} name="TDMS Delay" input={true} setter={props.setTdmsDelay} />
            </Show>
          </div>

          <Show when={props.filePaths().length > 0}>
            <button
              on:click={async () => {
                props.setisFinalizing(true);
              }}
              class={styles.finalizeButton}
            >
              Create Test with {props.filePaths().length} {props.filePaths().length > 1 ? "files" : "file"}
            </button>
          </Show>
        </div>
      </Resizable.Panel>
      <Resizable.Handle aria-label="Resize Handle" class={styles.panel_handle}>
        <div class={styles.panel_handle_div} />
      </Resizable.Handle>
      <Resizable.Panel initialSize={0.5} minSize={0.4} class={styles.panel}>
        <div class={styles.inputTitleDiv}>
          <SectionTitle title="Select Files:" />
          <UploadCreateButton selectFiles={props.isHDF5() ? selectHDF5Files : selectTDMSFiles} />
        </div>
        <For each={files()}>
          {(item) => <NewUploadComponent removeFile={props.isHDF5() ? removeHDF5File : removeTDMSFile} file={item} />}
        </For>
      </Resizable.Panel>
    </Resizable>
  );
};

export default UploadEditLayout;
