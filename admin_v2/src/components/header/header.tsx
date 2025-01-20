import { Component } from "solid-js";
import styles from "./header.module.css";
import { useState } from "../../state";
import Status from "./status";
import NavBarTitle from "./title";
import AuthButton from "./login_button";

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
  ] = useState();
  return (
    <div class={styles.header}>
      <NavBarTitle title="Admin Console" />
      <div class={styles.flexRowEnd} style="justify-content: end;">
        <Status />
        <AuthButton />
      </div>
    </div>
  );
};

export default Header;
