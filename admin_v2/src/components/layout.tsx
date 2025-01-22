import { Component, createMemo, createSignal, onMount, Show } from "solid-js";
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
import DefaultPage from "./defaults/default";
import { LogInComponent } from "./auth/auth";
import Logout from "./auth/logout";
import Billing from "./billing/billing";

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
    auth,
    setAuth,
  ] = useState();
  const permissions = createMemo(() => auth());
  onMount(async () => {
    await getGeneralTestInfo(setAllKnownTests, setDefaultTest);
    await getDefaultArticles(setDefaultTestArticle, setDefaultGSE);
    setLoadingState({ isLoading: false, statusMessage: "" });
  });
  return (
    <div class="m-0 p-0 flex flex-row h-[calc(100%-4rem)]">
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
              <Show when={permissions()! && permissions()!.includes("manage:defaults")} fallback={<LogInComponent />}>
                <DefaultPage />
              </Show>
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
        <Route
          path="/billing"
          component={() => (
            <PanelLayout>
              <Billing />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/login"
          component={() => (
            <PanelLayout>
              <LogInComponent />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/logout"
          component={() => (
            <PanelLayout>
              <Logout />
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
  const permissions = createMemo(() => auth());
  return (
    <Resizable sizes={sizes()} onSizesChange={setSizes}>
      <Resizable.Panel initialSize={0.2} minSize={0.2} class="pt-3">
        <NavBarItem name="Manage Tests" route="/" />
        {/* <NavBarItem name="Manage Articles" route="/articles" /> */}
        <NavBarItem name="New Test" route="/new" />
        <NavBarItem name="Instances" route="/instances" />
        <NavBarItem name="Analytics" route="/analytics" />
        <Show when={permissions()! && permissions()!.includes("manage:defaults")}>
          <NavBarItem name="Defaults" route="/defaults" />
        </Show>
        <Show when={permissions()! && permissions()!.includes("manage:billing")}>
          <NavBarItem name="Billing" route="/billing" />
        </Show>
        <Show when={permissions()!}>
          <NavBarItem name="Account" route="/account" />
        </Show>
      </Resizable.Panel>
      <Resizable.Handle aria-label="Resize Handle" class="bg-transparent border-none px-2 py-2">
        <div class="w-[2px] bg-white h-full" />
      </Resizable.Handle>
      <Resizable.Panel initialSize={0.8} minSize={0.5} class="p-0">
        {props.children}
      </Resizable.Panel>
    </Resizable>
  );
};
