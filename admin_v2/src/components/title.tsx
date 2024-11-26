import { Component } from "solid-js";
import styles from "./title.module.css";

const SectionTitle: Component<{title: string}> = (props) => {
  
  return <p class={styles.title}>{props.title}</p>;
};

export default SectionTitle;