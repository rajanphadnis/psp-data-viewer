import { createContext, createSignal, Signal, useContext } from "solid-js";
import { LoadingStateType, TestBasics } from "./types";

const AppStateContext = createContext();

const init_testData: TestBasics = {
  name: "Loading...",
  gse_article: "",
  test_article: "",
  id: "",
  starting_timestamp: 0,
  ending_timestamp: 0,
  // datasets: [""],
};

export function AppStateProvider(props: any) {
  const [allKnownTests, setAllKnownTests]: Signal<TestBasics[]> = createSignal([init_testData]);
  const [defaultTest, setDefaultTest] = createSignal<string>("");
  const [defaultGSE, setDefaultGSE] = createSignal<string>("");
  const [defaultTestArticle, setDefaultTestArticle] = createSignal<string>("");
  const [loadingState, setLoadingState]: Signal<LoadingStateType> = createSignal({
    isLoading: true,
    statusMessage: "Loading...",
  } as LoadingStateType);

  const datasetsThing = [
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
  ];

  return <AppStateContext.Provider value={datasetsThing}>{props.children}</AppStateContext.Provider>;
}

export function useState() {
  return useContext(AppStateContext);
}
