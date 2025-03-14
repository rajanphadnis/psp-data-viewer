import { Component, createSignal, Show } from "solid-js";
import CheckIcon from "../../../icons/check";
import IconCopy from "../../../icons/copy";
import DataExportModal from "../../../modal/data_export/modal";
import { delay } from "../../../../browser/util";
import { plotSnapshot } from "../../../../browser/image_tools";

const DataExportButton: Component<{}> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);
  return (
    <div class="flex w-full flex-row items-center">
      <button
        class="hover:bg-rush-light bg-rush mr-1 mb-1.25 flex w-9/10 cursor-pointer flex-row items-center justify-start border-none p-1.25"
        onclick={async () => {
          plotSnapshot("copy");
          setDone(true);
          await delay(1000);
          setDone(false);
        }}
      >
        <div class="mr-1.25 p-1.25 pb-0.5">
          <Show
            when={!showDone()}
            fallback={<CheckIcon class="w-3.5 fill-lime-400" />}
          >
            <IconCopy class="w-3.25 fill-black" />
          </Show>
        </div>
        <p class="m-0 text-xs font-bold text-black">
          <Show when={!showDone()} fallback={"Copied!"}>
            Copy Plot as Image
          </Show>
        </p>
      </button>
      <DataExportModal />
    </div>
  );
};

export default DataExportButton;
