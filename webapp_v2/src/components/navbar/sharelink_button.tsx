import { Component } from "solid-js";
import styles from "./navbar.module.css";
import { useState } from "../../state";

const SharelinkButton: Component<{}> = (props) => {
  const [activeDatasets, setActiveDatasets, { addDataset, updateDataset, removeDataset }]: any = useState();

  return (
    <button
      title="Copy link that points to the current plot config"
      class={styles.sharelinkButton}
      // disabled={activeDatasets().length == 0}
      style={{ opacity: activeDatasets().length == 0 ? 0 : 1 }}
    >
      Share
    </button>
  );
};

export default SharelinkButton;
