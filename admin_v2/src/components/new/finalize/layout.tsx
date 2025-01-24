import { Accessor, Component, createEffect, createSignal, For, onMount, Show } from "solid-js";
import { useState } from "../../../state";
import styles from "./finalize.module.css";
import { new_upload_hdf5, new_upload_tdsm_csv } from "../../../db/new";
import { doc, onSnapshot } from "firebase/firestore";
import CheckIcon from "../../icons/check";

const UploadFinalizeLayout: Component<{
  name: Accessor<string>;
  testArticle: Accessor<string>;
  gseArticle: Accessor<string>;
  filePaths: Accessor<File[]>;
  isHDF5: Accessor<boolean>;
  id: Accessor<string>;
  tdmsDelay: Accessor<number>;
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

  const [status, setStatus] = createSignal<string[]>(["Something Went Wrong", "Something Went Wrong", "0", "0"]);
  const [uploadPercent, setUploadPercent] = createSignal<number[]>(new Array<number>());
  onMount(async () => {
    console.log("mounted");
    setLoadingState({ isLoading: true, statusMessage: "Creating Test..." });
    if (props.isHDF5()) {
      await new_upload_hdf5(
        setStatus,
        props.filePaths(),
        props.id(),
        setUploadPercent,
        props.name(),
        props.gseArticle(),
        props.testArticle()
      );
    } else {
      await new_upload_tdsm_csv(
        setStatus,
        props.filePaths(),
        props.id(),
        setUploadPercent,
        props.name(),
        props.gseArticle(),
        props.testArticle(),
        props.tdmsDelay()
      );
    }
    const unsubscribe = onSnapshot(doc(globalThis.db, `/${props.id()}/test_creation`), (doc) => {
      console.log("Current data: ", doc);
      if (doc.data() != undefined) {
        setStatus([
          doc.data()!["creation_status"],
          doc.data()!["creation_status_next_step"],
          doc.data()!["creation_status_current"].toString(),
          doc.data()!["creation_status_max_steps"].toString(),
        ]);
      }
    });
  });

  createEffect(() => {
    if (status()[2] == status()[3]) {
      setLoadingState({ isLoading: false, statusMessage: "" });
    }
  });

  return (
    <div class={styles.finalizeDiv}>
      <Show when={status()[2] != status()[3]} fallback={<h1>Test Created!</h1>}>
        <h1>
          Creating Test from{" "}
          <Show when={!props.isHDF5()} fallback={"HDF5 file"}>
            TDMS file<Show when={props.filePaths().length > 0}>s</Show>
          </Show>
        </h1>
      </Show>
      <Show when={status()[2] == "1"}>
        <h3>Do not close this window while you can still read this message</h3>
      </Show>
      <div class={styles.finalizeSplit}>
        <div class={styles.splitDiv}>
          <p>Name: {props.name()}</p>
          <p>ID: {props.id()}</p>
          <p>Test Article: {props.testArticle()}</p>
          <p>GSE Article: {props.gseArticle()}</p>
          <Show when={!props.isHDF5()}>
            <p>TDMS Delay: {props.tdmsDelay()}s</p>
          </Show>
        </div>
        <Show when={!(uploadPercent().every((item) => item === uploadPercent()[0]) && uploadPercent()[0] == 1)}>
          <div class={styles.splitDiv} style={{ "align-items": "center", overflow: "auto", height: "100%" }}>
            <For each={uploadPercent()}>
              {(item, index) => {
                return (
                  <div class={styles.fileProgressDiv}>
                    <p>File {index() + 1}</p>
                    <progress value={item} />
                    <p>{(item * 100).toFixed(2)}%</p>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>
        <div class={styles.splitDiv} style={{ "align-items": "center" }}>
          <p>{status()[0]}</p>
          <p>{status()[1]}</p>
          <p>
            Step {status()[2]} of {status()[3]}
          </p>
          <Show when={status()[2] != status()[3]} fallback={<CheckIcon />}>
            <div class={styles.finalizeLoader}></div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default UploadFinalizeLayout;
