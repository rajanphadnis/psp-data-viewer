import { Component } from "solid-js";
import styles from "./tools.module.css";
import IconButton from "./icon_button";
import { IconJedi } from "../../../icons/easter";
import Dialog from "@corvu/dialog";
import EasterEggModal from "../../../modal/easter_egg_modal";

const ToolEasterEgg: Component<{}> = (props) => {
  return (
    <Dialog>
      <Dialog.Trigger title="Easter Egg" class={styles.button}>
        <IconButton>
          <IconJedi />
        </IconButton>
        <p class={styles.buttonTitle}>👀</p>
      </Dialog.Trigger>
      <EasterEggModal />
    </Dialog>
  );
};

export default ToolEasterEgg;
