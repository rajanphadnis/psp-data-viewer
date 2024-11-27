import { Accessor, Component, Setter } from "solid-js";
import TrashIcon from "../../icons/trash";
import styles from "./edit.module.css";
import { UploadFile } from "@solid-primitives/upload";
import IconDownload from "../../icons/download";

const NewUploadComponent: Component<{
  removeFile: (fileName: string) => void;
  file: UploadFile;
}> = (props) => {
  return (
    <div class={styles.uploadItemDiv}>
      <p style={{ width: "80%" }}>{props.file.name}</p>
      <div>
        <button
          class={styles.deleteButton}
          on:click={() => {
            window.open(props.file.source, "_blank");
          }}
          style={{ "margin-right": "10px" }}
        >
          <IconDownload />
        </button>
        <button
          class={styles.deleteButton}
          on:click={() => {
            props.removeFile(props.file.name);
          }}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default NewUploadComponent;
