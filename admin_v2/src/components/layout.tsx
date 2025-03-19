import Resizable from "@corvu/resizable";
import { makePersisted } from "@solid-primitives/storage";
import { Route, Router, useNavigate, useParams } from "@solidjs/router";
import { Component, createMemo, createSignal, onMount, Show } from "solid-js";
import { getDefaultArticles, getGeneralTestInfo } from "../db/db_interaction";
import { config } from "../generated_app_check_secret";
import { useState } from "../state";
import AccountPage from "./account/account";
import Analytics from "./analytics/analytics";
import { LogInComponent } from "./auth/auth";
import Logout from "./auth/logout";
import Billing from "./billing/billing";
import DefaultPage from "./defaults/default";
import Header from "./header/header";
import Instances from "./instances/instances";
import ManageTests from "./manage_tests/home";
import NavBarItem from "./navbar_item";
import NewTest from "./new/new";
import SelectOrg from "./select_org/select_org";
import ProcessRequest from "./process_request/process";

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
    org,
    setOrg,
  ] = useState();
  const permissions = createMemo(() => auth());

  return (
    <div class="m-0 flex h-full w-full flex-row p-0">
      <Router>
        <Route path="/" component={() => <SelectOrg />}></Route>
        <Route
          path="/:org/*all"
          component={() => {
            return (
              <PanelLayout>
                <ManageTests />
              </PanelLayout>
            );
          }}
        ></Route>
        <Route
          path="/:org/tests"
          component={() => {
            return (
              <PanelLayout>
                <ManageTests />
              </PanelLayout>
            );
          }}
        ></Route>
        <Route
          path="/:org/defaults"
          component={() => (
            <PanelLayout>
              <Show
                when={
                  permissions()! &&
                  permissions()!.includes(`${org()}:manage:defaults`)
                }
                fallback={<LogInComponent />}
              >
                <DefaultPage />
              </Show>
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/new"
          component={() => (
            <PanelLayout>
              <Show
                when={
                  permissions()! &&
                  permissions()!.includes(`${org()}:manage:tests`)
                }
                fallback={<LogInComponent />}
              >
                <NewTest />
              </Show>
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/instances"
          component={() => (
            <PanelLayout>
              <Show
                when={
                  permissions()! &&
                  permissions()!.includes(`${org()}:manage:instance`)
                }
                fallback={<LogInComponent />}
              >
                <Instances />
              </Show>
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/analytics"
          component={() => (
            <PanelLayout>
              <Analytics />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/billing"
          component={() => (
            <PanelLayout>
              <Show
                when={
                  permissions()! &&
                  permissions()!.includes(`${org()}:manage:billing`)
                }
                fallback={<LogInComponent />}
              >
                <Billing />
              </Show>
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/account"
          component={() => (
            <PanelLayout>
              <AccountPage />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/permissionsRequest/:approve/:requestCode/"
          component={() => (
            // <PanelLayout>
            <ProcessRequest />
            // </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/login"
          component={() => (
            <PanelLayout>
              <LogInComponent />
            </PanelLayout>
          )}
        ></Route>
        <Route
          path="/:org/logout"
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
    org,
    setOrg,
  ] = useState();
  const params = useParams();
  const permissions = createMemo(() => auth());
  const navigate = useNavigate();

  onMount(async () => {
    const keys = Object.keys(config);
    if (keys.includes(params.org) || params.org == "general") {
      if (params.org == "general") {
        console.log("skipping org redirect");
        setLoadingState({ isLoading: false, statusMessage: "" });
      } else {
        globalThis.db = globalThis.availableDBs[params.org];
        await getGeneralTestInfo(setAllKnownTests, setDefaultTest);
        await getDefaultArticles(setDefaultTestArticle, setDefaultGSE);
        setLoadingState({ isLoading: false, statusMessage: "" });
        setOrg(params.org);
      }
    } else {
      navigate("/", { replace: true });
    }
  });

  return (
    <div class="flex h-full w-full flex-col">
      <Header />
      <div class="m-0 h-[calc(100%-4rem)] w-full p-0">
        <Resizable sizes={sizes()} onSizesChange={setSizes}>
          <Resizable.Panel initialSize={0.2} minSize={0.2} class="pt-3">
            <Show when={org()}>
              <NavBarItem
                name={permissions() ? "Manage Tests" : "Tests"}
                route={`/${params.org}/tests`}
              />
            </Show>
            <Show
              when={
                permissions()! &&
                permissions()!.includes(`${org()}:manage:tests`)
              }
            >
              <NavBarItem name="New Test" route={`/${params.org}/new`} />
            </Show>
            <Show
              when={
                permissions()! &&
                permissions()!.includes(`${org()}:manage:instance`)
              }
            >
              <NavBarItem name="Instances" route={`/${params.org}/instances`} />
            </Show>
            <Show when={org()!}>
              <NavBarItem name="Analytics" route={`/${params.org}/analytics`} />
            </Show>
            <Show
              when={
                permissions()! &&
                permissions()!.includes(`${org()}:manage:defaults`)
              }
            >
              <NavBarItem name="Defaults" route={`/${params.org}/defaults`} />
            </Show>
            <Show
              when={
                permissions()! &&
                permissions()!.includes(`${org()}:manage:billing`)
              }
            >
              <NavBarItem name="Billing" route={`/${params.org}/billing`} />
            </Show>
            <Show when={permissions()!}>
              <NavBarItem name="Account" route={`/${params.org}/account`} />
            </Show>
          </Resizable.Panel>
          <Resizable.Handle
            aria-label="Resize Handle"
            class="border-none bg-transparent px-2 py-2"
          >
            <div class="h-full w-[2px] bg-white" />
          </Resizable.Handle>
          <Resizable.Panel initialSize={0.8} minSize={0.5} class="p-0">
            {props.children}
          </Resizable.Panel>
        </Resizable>
      </div>
    </div>
  );
};
