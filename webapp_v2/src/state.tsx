import { Accessor, createContext, createSignal, Setter, Signal, useContext } from "solid-js";
import { defaultPlottingColors } from "./theming";
import { LoadingStateType, TestBasics, Preferences, PlotRange } from "./types";

const init_loadingState: LoadingStateType = { isLoading: true, statusMessage: "Loading..." };
const init_testData: TestBasics = {
  name: "Loading...",
  gse_article: "",
  test_article: "",
  id: "",
  starting_timestamp: 0,
  ending_timestamp: 0,
  datasets: [""],
};
const init_Preferences: Preferences = {
  displayedSamples: 4000,
  axesSets: 6,
};

const AppStateContext = createContext();

export function AppStateProvider(props: any) {
  const [activeDatasets, setActiveDatasets]: Signal<string[]> = createSignal(new Array<string>());
  const [appReadyState, setAppReadyState]: Signal<boolean> = createSignal(false);
  const [loadingState, setLoadingState]: Signal<LoadingStateType> = createSignal(init_loadingState);

  const [testBasics, setTestBasics]: Signal<TestBasics> = createSignal(init_testData);
  const [allKnownTests, setAllKnownTests]: Signal<TestBasics[]> = createSignal(new Array<TestBasics>());

  // export const [activeDatasets, setActiveDatasets]: Signal<string[]> = createSignal(new Array<string>());
  const [datasetsLegendSide, setDatasetsLegendSide]: Signal<number[]> = createSignal(new Array<number>());

  const [plotRange, setPlotRange]: Signal<PlotRange> = createSignal({ start: 0, end: 0 });
  const [plotPalletteColors, setPlotPalletteColors]: Signal<string[]> = createSignal(defaultPlottingColors);

  const [sitePreferences, setSitePreferences]: Signal<Preferences> = createSignal(init_Preferences);

  const datasetsThing = [
    activeDatasets,
    setActiveDatasets,
    appReadyState,
    setAppReadyState,
    loadingState,
    setLoadingState,
    testBasics,
    setTestBasics,
    allKnownTests,
    setAllKnownTests,
    datasetsLegendSide,
    setDatasetsLegendSide,
    plotRange,
    setPlotRange,
    plotPalletteColors,
    setPlotPalletteColors,
    sitePreferences,
    setSitePreferences,
    {
      addDataset(dataset: string) {
        setLoadingState({ isLoading: true, statusMessage: "Adding..." });
        setAppReadyState(false);
        setActiveDatasets((prev) => [...prev, dataset]);
        setDatasetsLegendSide((prev) => [...prev, 1]);
        setAppReadyState(true);
        // setLoadingState({ isLoading: false, statusMessage: "" });
      },
      updateDataset(dataset: string) {
        setLoadingState({ isLoading: true, statusMessage: "Updating..." });
        const updateIndex = activeDatasets().indexOf(dataset, 0);
        const currentAxis = datasetsLegendSide()[updateIndex];
        if (currentAxis == sitePreferences().axesSets) {
          setDatasetsLegendSide((prev) => {
            prev[updateIndex] = 1;
            return prev;
          });
        } else {
          setDatasetsLegendSide((prev) => {
            prev[updateIndex] = prev[updateIndex] + 1;
            return prev;
          });
        }
        // setLoadingState({ isLoading: false, statusMessage: "" });
      },
      removeDataset(dataset: string) {
        setLoadingState({ isLoading: true, statusMessage: "Removing..." });
        const removeIndex = activeDatasets().indexOf(dataset);
        if (removeIndex > -1) {
          setAppReadyState(false);
          setActiveDatasets((prev) => {
            const newDatasets = prev;
            newDatasets.splice(removeIndex, 1);
            return [...newDatasets];
          });
          setDatasetsLegendSide((prev) => {
            const newLegendSide = datasetsLegendSide();
            newLegendSide.splice(removeIndex, 1);
            return [...newLegendSide];
          });
          setAppReadyState(true);
        }
      },
    },
  ];

  return <AppStateContext.Provider value={datasetsThing}>{props.children}</AppStateContext.Provider>;
}

export function useState() {
  return useContext(AppStateContext);
}

// export function getState(): [(Accessor<string[]> | Setter<string[]>)[] | (Accessor<boolean> | Setter<boolean>)[]] {
//   const context: any = useState();
//   const act: Accessor<string[]> = context.activeDatasets;
//   const setAct: Setter<string[]> = context.setActiveDatasets;
//   const ready: Accessor<boolean> = context.appReadyState;
//   const setReady: Setter<boolean> = context.setAppReadyState;

//   return [act, setAct, ready, setReady];
// }
