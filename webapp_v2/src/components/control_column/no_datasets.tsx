import { Component } from "solid-js";
import styles from "./column.module.css";

const NoDatasetsMessage: Component<{}> = (props) => {
  return (
    <div class={styles.noDatasets}>
      <p>No datasets selected</p>
    </div>
  );
};

export default NoDatasetsMessage;
