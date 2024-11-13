import { Accessor, Component, Show } from "solid-js";
import styles from "./navbar.module.css";
import layout from "../../layout.module.css";
import SwitchTestButton from "./switch_test";
import SettingsButton from "./settings_button";
import { useState } from "../../state";
import { TestBasics } from "../../types";

const NavBarTitle: Component<{ id: string; name: string; test_article: string; gse_article: string }> = (props) => {
  // : Component<{ children: any; testBasics: Accessor<TestBasics>; }>
  // const context: any = useState();
  return (
    <div class={layout.flexRowStart} style="justify-content: start;">
      <Show when={props.id != ""} fallback={<div class={styles.title}>{props.name}</div>}>
        <div class={styles.title}>
          PSP Data Viewer:{props.test_article}:{props.gse_article}:{props.name}
        </div>
        <SwitchTestButton />
        <SettingsButton />
      </Show>
    </div>
  );
};

export default NavBarTitle;
