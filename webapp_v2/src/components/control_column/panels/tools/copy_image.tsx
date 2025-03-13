import { Component, createSignal, Show } from "solid-js";
import { plotSnapshot } from "../../../../browser/image_tools";
import { delay } from "../../../../browser/util";
import CheckIcon from "../../../icons/check";
import IconCopy from "../../../icons/copy";
import IconButton from "./icon_button";

const ToolCopyImage: Component<{}> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);
  return (
    <button
      class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25"
      onclick={async () => {
        plotSnapshot("copy");
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <IconButton>
        <Show when={!showDone()} fallback={<CheckIcon />}>
          <IconCopy />
        </Show>
      </IconButton>
      <p class="m-0 font-bold text-black text-xs">
        <Show when={!showDone()} fallback={"Copied!"}>
          Copy Plot as Image
        </Show>
      </p>
    </button>
  );
};

export default ToolCopyImage;
