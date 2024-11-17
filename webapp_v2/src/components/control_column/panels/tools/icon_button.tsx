import { Component, JSX } from "solid-js";
import styles from "./tools.module.css";

const IconButton: Component<{ children?: JSX.Element }> = (props) => {
  return <div class={styles.icon}>{props.children}</div>;
};

export default IconButton;
