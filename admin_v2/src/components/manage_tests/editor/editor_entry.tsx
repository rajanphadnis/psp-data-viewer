import { Accessor, Component, createSignal, Setter, Show } from "solid-js";
import styles from "./editor.module.css";
import { TestData } from "../../../types";
import { DateTimePicker } from "date-time-picker-solid";
import { copyTextToClipboard, delay } from "../../../browser_interactions";

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

export const EditorDeleteButton: Component<{ id: string }> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);

  return (
    <button
      on:click={async () => {
        const deleteLink = `https://deletetest-w547ikcrwa-uc.a.run.app/?id=${props.id}`;
        copyTextToClipboard(deleteLink);
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
      class={styles.deleteButton}
    >
      <Show when={!showDone()} fallback={"Copied!"}>
        Copy Delete Link
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
