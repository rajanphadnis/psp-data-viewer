import { Component } from "solid-js";
import styles from "./modal.module.css";

const TestEntry: Component<{ children?: any; test_id: string }> = (props) => {
  return (
    <button
      class={styles.testEntry}
      onclick={() => {
        window.location.href = window.location.origin + "/" + props.test_id;
      }}
    >
      {props.children}
    </button>
  );
};

export default TestEntry;
