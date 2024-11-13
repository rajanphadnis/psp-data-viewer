import { Component } from "solid-js";
import styles from "./navbar.module.css";
import SwapIcon from "../icons/swap";

const SwitchTestButton: Component<{}> = (props) => {
  return (
    <button title="Change Active Test" class={styles.navbarButtons}>
      <SwapIcon/>
    </button>
  );
};

export default SwitchTestButton;
