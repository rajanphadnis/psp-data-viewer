import { Accessor, createContext, createSignal, Setter, Signal, useContext } from "solid-js";
import { defaultPlottingColors } from "./theming";

const AppStateContext = createContext();

export function AppStateProvider(props: any) {
  const [activeDatasets, setActiveDatasets]: Signal<string[]> = createSignal(new Array<string>());
  const [appReadyState, setAppReadyState]: Signal<boolean> = createSignal(false);

  const [loadingDatasets, setLoadingDatasets]: Signal<string[]> = createSignal(new Array<string>());
  const [datasetsLegendSide, setDatasetsLegendSide]: Signal<number[]> = createSignal(new Array<number>());

  const [plotPalletteColors, setPlotPalletteColors]: Signal<string[]> = createSignal(defaultPlottingColors);


  const datasetsThing = [
    activeDatasets,
    setActiveDatasets,
    appReadyState,
    setAppReadyState,
    datasetsLegendSide,
    setDatasetsLegendSide,
    plotPalletteColors,
    setPlotPalletteColors,
    loadingDatasets,
    setLoadingDatasets,
    {
      addDataset(dataset: string) {
        
      },
      updateDataset(dataset: string) {
        
      },
      removeDataset(dataset: string) {
        
      },
      updateColor(dataset: string, color: string) {
        
      },
    },
  ];

  return <AppStateContext.Provider value={datasetsThing}>{props.children}</AppStateContext.Provider>;
}

export function useState() {
  return useContext(AppStateContext);
}
