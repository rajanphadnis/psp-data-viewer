import { Component, Show } from "solid-js";
import styles from "./header.module.css";
import { useState } from "../../state";
import Dialog from "@corvu/dialog";
import SwapIcon from "../icons/swap";
import SettingsIcon from "../icons/settings";

const NavBarTitle: Component<{ title: string }> = (props) => {
  const [allKnownTests, setAllKnownTests, loadingState, setLoadingState]: any = useState();
  return (
    <div class={styles.flexRowStart} style="justify-content: start;">
      <Show when={allKnownTests().length != 0} fallback={<div class={styles.title}>Loading...</div>}>
        <p class={styles.title}>PSP Data Viewer:{props.title}</p>
      </Show>
    </div>
  );
};

export default NavBarTitle;
