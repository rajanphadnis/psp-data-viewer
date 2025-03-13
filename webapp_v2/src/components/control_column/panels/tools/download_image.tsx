import { Component, createSignal, Show } from "solid-js";
import { plotSnapshot } from "../../../../browser/image_tools";
import { delay } from "../../../../browser/util";
import CheckIcon from "../../../icons/check";
import IconDownload from "../../../icons/download";
import IconButton from "./icon_button";

const ToolDownloadImage: Component<{}> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);
  return (
    <button
      class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25"
      onclick={async () => {
        plotSnapshot("download");
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <IconButton>
        <Show when={!showDone()} fallback={<CheckIcon />}>
          <IconDownload />
        </Show>
      </IconButton>
      <p class="m-0 font-bold text-black text-xs">
        <Show when={!showDone()} fallback={"Downloaded!"}>
          Download Plot as Image
        </Show>
      </p>
    </button>
  );
};

export default ToolDownloadImage;
