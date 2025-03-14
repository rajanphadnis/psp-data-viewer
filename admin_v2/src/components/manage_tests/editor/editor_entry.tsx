import { httpsCallable } from "firebase/functions";
import { Component, createSignal, Setter, Show } from "solid-js";
import { copyTextToClipboard, delay } from "../../../browser_interactions";
import { config } from "../../../generated_app_check_secret";

export const EditorEntry: Component<{ testData: any; name: string; input: boolean; setter?: Setter<string> }> = (
  props
) => {
  const [showDone, setDone] = createSignal<boolean>(false);

  return (
    <div
      class="flex flex-row justify-between items-center py-1.5 border-b-white border-b"
      on:click={async () => {
        copyTextToClipboard(props.testData);
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <label class="mr-2.5">
        <p>{props.name}:</p>
      </label>
      <Show
        when={props.input}
        fallback={
          <p class="mr-2.5">
            <Show when={!showDone()} fallback={"Copied!"}>
              {props.testData}
            </Show>
          </p>
        }
      >
        <input
          value={props.testData}
          class="bg-bg border-2 border-rush-light p-2.5 w-80 text-white focus:border-aged focus:outline-0 disabled:border-0 disabled:bg-transparent"
          on:input={(e) => {
            props.setter!(e.target.value.trim());
          }}
        ></input>
      </Show>
    </div>
  );
};

export const EditorDeleteButton: Component<{ id: string; slug: string }> = (props) => {
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
          })
            .then((result) => {
              console.log(result);
              setDone(true);
              window.location.reload();
            })
            .catch((err) => {
              console.error(err);
              setDone(true);
            });
        }
      }}
      class="p-2.5 bg-rush text-black font-bold border-0 cursor-pointer hover:bg-rush-light"
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
      class="bg-transparent border-0 w-full cursor-pointer text-white p-2.5 text-start hover:bg-cool-grey"
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
