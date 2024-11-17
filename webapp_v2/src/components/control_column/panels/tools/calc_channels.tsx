import { Component } from "solid-js";
import IconSum from "../../../icons/sum";
import styles from "./tools.module.css";
import IconButton from "./icon_button";

const ToolCalcChannel: Component<{}> = (props) => {
  return (
    <button class={styles.button}>
      <IconButton>
        <IconSum />
      </IconButton>
      <p class={styles.buttonTitle}>Calc Channels</p>
    </button>
  );
};

export default ToolCalcChannel;
