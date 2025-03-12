import { createFileUploader } from "@solid-primitives/upload";
import { Accessor, Component, createEffect, Setter, Show } from "solid-js";
import { appVersion } from "../../../generated_app_check_secret";
import { useState } from "../../../state";
import { EditorEntry } from "../../manage_tests/editor/editor_entry";
import SectionTitle from "../../title";
import UploadCreateButton from "./add_file_button";
import ListedFileComponent from "./upload_component";

const UploadEditLayout: Component<{
  name: Accessor<string>;
  testArticle: Accessor<string>;
  gseArticle: Accessor<string>;
  filePath: Accessor<File | undefined>;
  setFilePath: Setter<File | undefined>;
  setisFinalizing: Setter<boolean>;
  setName: Setter<string>;
  setTestArticle: Setter<string>;
  setGseArticle: Setter<string>;
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
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();
  const {
    files: files,
    selectFiles: selectHDF5Files,
    removeFile: removeHDF5File,
  } = createFileUploader({
    multiple: false,
    accept: ".hdf5",
  });

  createEffect(() => {
    const toReturnHDF5 = files().map((val) => val.file).pop();
    props.setFilePath(() => toReturnHDF5);
  });

  return (
    <div class="w-full h-full flex flex-col justify-between items-center">
      <div class="w-full">
        <SectionTitle title="Create Test:" />
        <EditorEntry testData={props.name()} name="Test Name" input={true} setter={props.setName} />
        <EditorEntry
          testData={props.testArticle()}
          name="Test Article"
          input={true}
          setter={props.setTestArticle}
        />
        <EditorEntry testData={props.gseArticle()} name="GSE Article" input={true} setter={props.setGseArticle} />
        <Show when={props.filePath() == undefined} fallback={<ListedFileComponent setFilePath={props.setFilePath} filePath={props.filePath} />}>
          <div class="mr-3">
            <h3 class="text-xl font-bold mt-4 mb-2">Looking for TDMS and CSV file upload?</h3>
            <p>
              Download{" "}
              <a
                href={`https://github.com/rajanphadnis/psp-data-viewer/releases/download/${appVersion}/desktop-app.exe`}
                class="underline underline-offset-auto"
              >
                the desktop app
              </a>{" "}
              to combine your TDMS and CSV files, then come back here and upload the generated file.<br /><br />View the latest desktop app release <a
                href={`https://github.com/rajanphadnis/psp-data-viewer/releases/tag/${appVersion}`}
                target="_blank"
                class="underline underline-offset-auto"
              >
                here
              </a>.
            </p>
          </div>
        </Show>
      </div>
      <Show when={props.filePath() == undefined}>
        <UploadCreateButton selectFiles={selectHDF5Files} setFilePath={props.setFilePath} />
      </Show>
      <Show when={props.filePath()}>
        <button
          on:click={async () => {
            if (props.name() != "" && props.gseArticle() != "" && props.testArticle() != "") {
              props.setisFinalizing(true);
            }
            else {
              alert("Please make sure you've filled out all fields before creating the test");
            }
          }}
          class="w-3/4 border-0 m-2.5 text-black font-bold bg-rush cursor-pointer p-5 flex flex-row text-center justify-center items-center hover:bg-rush-light"
        >
          Create Test
        </button>
      </Show>
    </div>
  );
};

export default UploadEditLayout;
