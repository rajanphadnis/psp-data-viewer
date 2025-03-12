import { Accessor, createContext, createSignal, Setter, Signal, useContext } from "solid-js";
import { defaultPlottingColors } from "./theming";
import { LoadingStateType, TestBasics, Preferences, PlotRange, MeasureData, Annotation } from "./types";
import { clearDatums } from "./browser/measure";
import { makePersisted } from "@solid-primitives/storage";

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
  displayedSamples: 3000,
  axesSets: 6,
};
const init_measuringTool: MeasureData = { x1: undefined, x2: undefined, y1: [], y2: [], toolColor: "#ffa500" };

const AppStateContext = createContext();

export function AppStateProvider(props: any) {
  const [activeDatasets, setActiveDatasets]: Signal<string[]> = createSignal(new Array<string>());
  const [appReadyState, setAppReadyState]: Signal<boolean> = createSignal(false);
  const [loadingState, setLoadingState]: Signal<LoadingStateType> = createSignal(init_loadingState);

  const [testBasics, setTestBasics]: Signal<TestBasics> = createSignal(init_testData);
  const [allKnownTests, setAllKnownTests]: Signal<TestBasics[]> = createSignal(new Array<TestBasics>());

  const [loadingDatasets, setLoadingDatasets]: Signal<string[]> = createSignal(new Array<string>());
  const [measuring, setMeasuring] = makePersisted(createSignal<MeasureData>(init_measuringTool), {
    name: "measuring-storage",
  });
  const [datasetsLegendSide, setDatasetsLegendSide]: Signal<number[]> = createSignal(new Array<number>());

  const [plotRange, setPlotRange]: Signal<PlotRange> = createSignal({ start: 0, end: 0 });
  const [plotPalletteColors, setPlotPalletteColors]: Signal<string[]> = createSignal(defaultPlottingColors);

  const [sitePreferences, setSitePreferences] = makePersisted(createSignal<Preferences>(init_Preferences), {
    name: "preference-storage",
  });
  const [annotations, setAnnotations] = createSignal(new Array<Annotation>());

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
    loadingDatasets,
    setLoadingDatasets,
    measuring,
    setMeasuring,
    annotations,
    setAnnotations,
    {
      addDataset(dataset: string) {
        setLoadingState({ isLoading: true, statusMessage: "Adding..." });
        setAppReadyState(false);
        setActiveDatasets((prev) => [...prev, dataset]);
        setDatasetsLegendSide((prev) => [...prev, 1]);
        clearDatums(measuring, setMeasuring);
        setAppReadyState(true);
      },
      updateDataset(dataset: string) {
        setLoadingState({ isLoading: true, statusMessage: "Updating..." });
        const updateIndex = activeDatasets().indexOf(dataset, 0);
        const currentAxis = datasetsLegendSide()[updateIndex];
        setAppReadyState(false);
        if (currentAxis == sitePreferences().axesSets) {
          setDatasetsLegendSide((prev) => {
            prev[updateIndex] = 1;
            return [...prev];
          });
        } else {
          setDatasetsLegendSide((prev) => {
            prev[updateIndex] = prev[updateIndex] + 1;
            return [...prev];
          });
        }
        clearDatums(measuring, setMeasuring);
        setAppReadyState(true);
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
          clearDatums(measuring, setMeasuring);
          setAppReadyState(true);
        }
      },
      updateColor(dataset: string, color: string) {
        setAppReadyState(false);
        const index = activeDatasets().indexOf(dataset);
        const listOfColors = [...plotPalletteColors()];
        listOfColors[index] = color;
        setPlotPalletteColors([...listOfColors]);
        setAppReadyState(true);
      },
    },
  ];

  return <AppStateContext.Provider value={datasetsThing}>{props.children}</AppStateContext.Provider>;
}

export function useState() {
  return useContext(AppStateContext);
}

export type StateType = [
  activeDatasets: Accessor<string[]>,
  setActiveDatasets: Setter<string[]>,
  appReadyState: Accessor<boolean>,
  setAppReadyState: Setter<boolean>,
  loadingState: Accessor<LoadingStateType>,
  setLoadingState: Setter<LoadingStateType>,
  testBasics: Accessor<TestBasics>,
  setTestBasics: Setter<TestBasics>,
  allKnownTests: Accessor<TestBasics[]>,
  setAllKnownTests: Setter<TestBasics[]>,
  datasetsLegendSide: Accessor<number[]>,
  setDatasetsLegendSide: Setter<number[]>,
  plotRange: Accessor<PlotRange>,
  setPlotRange: Setter<PlotRange>,
  plotPalletteColors: Accessor<string[]>,
  setPlotPalletteColors: Setter<string[]>,
  sitePreferences: Accessor<Preferences>,
  setSitePreferences: Setter<Preferences>,
  loadingDatasets: Accessor<string[]>,
  setLoadingDatasets: Setter<string[]>,
  measuring: Accessor<MeasureData>,
  setMeasuring: Setter<MeasureData>,
  annotations: Accessor<Annotation[]>,
  setAnnotations: Setter<Annotation[]>,
  {
    addDataset: (dataset: string) => void,
    updateDataset: (dataset: string) => void,
    removeDataset: (dataset: string) => void,
    updateColor: (dataset: string, color: string) => void,
  }
];

