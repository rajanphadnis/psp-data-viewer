import { Accessor, Component, createSignal, Show } from "solid-js";
import { copyTextToClipboard, delay } from "../../../browser_interactions";
import PlusIcon from "../../icons/plus";
import styles from "./edit.module.css";
import { createFileUploader, UploadFile } from "@solid-primitives/upload";

export const UploadCreateButton: Component<{
  selectFiles: (callback: (files: UploadFile[]) => void | Promise<void>) => void;
}> = (props) => {
  return (
    <button
      on:click={() => {
        props.selectFiles((files) => files.forEach((file) => console.log(file)));
      }}
      class={styles.addButton}
    >
      <PlusIcon />
    </button>
  );
};

export default UploadCreateButton;
