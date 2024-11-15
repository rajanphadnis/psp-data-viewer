import { Component, createSignal, Show } from "solid-js";
import styles from "./tools.module.css";
import IconButton from "./icon_button";
import IconCopy from "../../icons/copy";
import { plotSnapshot } from "../../../browser/image_tools";
import IconDownload from "../../icons/download";
import CheckIcon from "../../icons/check";
import { delay } from "../../../browser/util";

const ToolDownloadImage: Component<{}> = (props) => {
  const [showDone, setDone] = createSignal<boolean>(false);
  return (
    <button
      class={styles.button}
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
      <p class={styles.buttonTitle}>
        <Show when={!showDone()} fallback={"Downloaded!"}>
          Download Plot as Image
        </Show>
      </p>
    </button>
  );
};

export default ToolDownloadImage;
