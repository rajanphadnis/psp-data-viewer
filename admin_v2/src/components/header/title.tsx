import { Component, Show } from "solid-js";
import styles from "./header.module.css";
import { useState } from "../../state";
import Dialog from "@corvu/dialog";
import SwapIcon from "../icons/swap";
import SettingsIcon from "../icons/settings";
import { config } from "../../generated_app_check_secret";

const NavBarTitle: Component<{ title: string }> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();
  return (
    <div class={styles.flexRowStart} style="justify-content: start;">
      <Show when={allKnownTests().length != 0} fallback={<div class={styles.title}>Loading...</div>}>
        <p class={styles.title}>
          {org() ? `${(config as any)[org()!]["naming"]["page_title"]}:` : ""}
          {props.title}
        </p>
      </Show>
    </div>
  );
};

export default NavBarTitle;
