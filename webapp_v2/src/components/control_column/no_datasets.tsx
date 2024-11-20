import { Component } from "solid-js";
import styles from "./column.module.css";

const NoDatasetsMessage: Component<{ children?: any }> = (props) => {
  return <div class={styles.noDatasets}>{props.children}</div>;
};

export default NoDatasetsMessage;
