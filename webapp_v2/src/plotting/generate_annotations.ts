import { AlignedData, Series } from "uplot";
import { useState, StateType } from "../state";
import uPlot from "uplot";

export function annotateData(actual_data: number[][]) {
  // (1728329398.0900002, 1)
  const [
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
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;
  const annotation_data_length = actual_data[0].length;
  const zeroes = Math.floor((annotation_data_length - 5) / 2);
  const anns = annotation_data_length - zeroes * 2;
  console.log(zeroes);
  console.log(anns);
  const annotation_test = [...Array(zeroes).fill(0), ...Array(anns).fill(1), ...Array(zeroes).fill(0)];
  console.log(annotation_test);
  const annotated_data = [...actual_data, annotation_test];
  console.log(annotated_data);
  return annotated_data as AlignedData;
}

export function annotateSeries(series: ({} | Series)[]) {
  const annotated_series: Series[] = [
    ...series,
    {
      paths: uPlot.paths.bars!({
        size: [Infinity, Infinity, 1],
        gap: 0,
      }),
      stroke: "green",
      fill: "green",
      scale: "annotation",
      label: " ",
      // value: undefined,
      class: "hiddenLegendItem",
    },
  ];
  return annotated_series;
}
