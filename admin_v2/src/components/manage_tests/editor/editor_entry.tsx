import { Accessor, Component, createSignal, Setter, Show } from "solid-js";
import styles from "./editor.module.css";
import { TestData } from "../../../types";
import { DateTimePicker } from "date-time-picker-solid";
import { copyTextToClipboard, delay } from "../../../browser_interactions";
import { httpsCallable } from "firebase/functions";
import { config } from "../../../generated_app_check_secret";

export const EditorEntry: Component<{ testData: any; name: string; input: boolean; setter?: Setter<string> }> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);

  return (
    <div
      class={styles.inputDiv}
      on:click={async () => {
        copyTextToClipboard(props.testData);
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <label style={{ "margin-right": "10px" }}>
        <p>{props.name}:</p>
      </label>
      <Show
        when={props.input}
        fallback={
          <p style={{ "margin-right": "10px" }}>
            <Show when={!showDone()} fallback={"Copied!"}>
              {props.testData}
            </Show>
          </p>
        }
      >
        <input
          value={props.testData}
          class={styles.inputText}
          on:input={(e) => {
            props.setter!(e.target.value.trim());
          }}
        ></input>
        {/* {props.children} */}
      </Show>
    </div>
  );
};

export const EditorDeleteButton: Component<{ id: string, slug: string }> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(true);

  return (
    <button
      on:click={async () => {
        const continue_deletion = confirm("Are you sure you want to delete this test?");
        if (continue_deletion) {
          setDone(false);
          const delete_test = httpsCallable(globalThis.functions, "delete_test");
          delete_test({
            id: props.id,
            db_id: (config as any)[props.slug].firebase.databaseID,
            slug: props.slug,
            share_name: (config as any)[props.slug].azure.share_name,
            storage_acct_name: (config as any)[props.slug].azure.storage_account,
          }).then((result) => {
            console.log(result);
            setDone(true);
            window.location.reload();
          }).catch((err) => {
            console.error(err);
            setDone(true);
          });
        }
      }}
      class={styles.deleteButton}
    >
      <Show when={showDone()} fallback={"Deleting..."}>
        Delete Test
      </Show>
    </button>
  );
};

export const EditorDatasetButton: Component<{ dataset: string }> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);

  return (
    <button
      class={styles.datasetButton}
      on:click={async () => {
        copyTextToClipboard(props.dataset);
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <Show when={!showDone()} fallback={"Copied!"}>
        {props.dataset.split("__")[0]} ({props.dataset.split("__")[1]})
      </Show>
    </button>
  );
};
