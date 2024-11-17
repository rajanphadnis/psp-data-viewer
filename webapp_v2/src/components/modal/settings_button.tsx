import { Component } from "solid-js";
import styles from "./modal.module.css";

const SettingsButton: Component<{
  children?: any;
  name: string;
  onclick: () => void;
}> = (props) => {
  return (
    <button
      class={styles.settingsButton}
      onclick={() => {
        props.onclick();
      }}
    >
      <p class={styles.settingsButtonName}>{props.name}</p>
      {props.children}
    </button>
  );
};

export default SettingsButton;
