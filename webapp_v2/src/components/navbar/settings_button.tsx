import { Component } from "solid-js";
import styles from "./navbar.module.css";
import SettingsIcon from "../icons/settings";

const SettingsButton: Component<{}> = (props) => {
  return (
    <button title="Settings" class={styles.navbarButtons}>
      <SettingsIcon/>
      {/* <span class="material-symbols-outlined">settings</span> */}
    </button>
  );
};

export default SettingsButton;
