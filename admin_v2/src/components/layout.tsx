import { children, Component, createSignal, onMount } from "solid-js";
import styles from "./resizeable.module.css";
import Resizable from "@corvu/resizable";
import { makePersisted } from "@solid-primitives/storage";
import { Router, Route, A } from "@solidjs/router";
import HomeComponent from "./home/home";
import Instances from "./instances/instances";
import { getDefaultArticles, getGeneralTestInfo } from "../db/db_interaction";
import { useState } from "../state";
import NavBarItem from "./navbar_item";
import Analytics from "./analytics/analytics";
import NewTest from "./new/new";
import Articles from "./articles/articles";
import DefaultPage from "./defaults/default";

const MainLayout: Component<{}> = (props) => {
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
  ]: any = useState();
  onMount(async () => {
    await getGeneralTestInfo(setAllKnownTests, setDefaultTest);
    await getDefaultArticles(setDefaultTestArticle, setDefaultGSE);
    setLoadingState({ isLoading: false, statusMessage: "" });
  });
  return (
    <div class={styles.main}>
      <Router>
        <Route
          path="/:path?"
          component={() => (
            <PanelLayout>
              <HomeComponent />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/defaults"
          component={() => (
            <PanelLayout>
              <DefaultPage />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/new"
          component={() => (
            <PanelLayout>
              <NewTest />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/instances"
          component={() => (
            <PanelLayout>
              <Instances />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/analytics"
          component={() => (
            <PanelLayout>
              <Analytics />
            </PanelLayout>
          )}
        ></Route>
      </Router>
    </div>
  );
};

export default MainLayout;

const PanelLayout: Component<{ children?: any }> = (props) => {
  const [sizes, setSizes] = makePersisted(createSignal<number[]>([]), {
    name: "resizable-index-sizes",
  });
  return (
    <Resizable sizes={sizes()} onSizesChange={setSizes}>
      <Resizable.Panel initialSize={0.2} minSize={0.2} class={`${styles.panel} ${styles.panelPadding}`}>
        <NavBarItem name="Manage Tests" route="/" />
        {/* <NavBarItem name="Manage Articles" route="/articles" /> */}
        <NavBarItem name="New Test" route="/new" />
        <NavBarItem name="Instances" route="/instances" />
        <NavBarItem name="Analytics" route="/analytics" />
        <NavBarItem name="Defaults" route="/defaults" />
      </Resizable.Panel>
      <Resizable.Handle aria-label="Resize Handle" class={styles.panel_handle}>
        <div class={styles.panel_handle_div} />
      </Resizable.Handle>
      <Resizable.Panel initialSize={0.8} minSize={0.5} class={styles.panel}>
        {props.children}
      </Resizable.Panel>
    </Resizable>
  );
};
