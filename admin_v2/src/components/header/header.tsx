import { Component } from "solid-js";
import styles from "./header.module.css";
import { useState } from "../../state";
import Status from "./status";
import NavBarTitle from "./title";

const Header: Component<{}> = () => {
  const [allKnownTests, setAllKnownTests, loadingState, setLoadingState]: any = useState();
  return (
    <div class={styles.header}>
      <NavBarTitle title="Admin Console" />
      <div class={styles.flexRowEnd} style="justify-content: end;">
        <Status />
        {/* <SharelinkButton /> */}
      </div>
    </div>
  );
};

export default Header;
