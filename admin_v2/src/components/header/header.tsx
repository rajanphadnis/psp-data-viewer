import { Component } from "solid-js";
import styles from "./header.module.css";
import Status from "./status";
import NavBarTitle from "./title";
import AuthButton from "./login_button";
import { useState } from "../../state";

const Header: Component<{}> = () => {
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
    <div class="px-4 flex flex-row items-center justify-between pb-0 pt-2 h-16 max-h-16 min-h-16">
      <NavBarTitle title="Admin Console" />
      <div class={styles.flexRowEnd} style="justify-content: end;">
        <Status />
        <AuthButton />
      </div>
    </div>
  );
};

export default Header;
