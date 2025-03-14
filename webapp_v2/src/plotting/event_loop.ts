import { Accessor, Setter } from "solid-js";
import { Series } from "uplot";
import { storeActiveDatasets } from "../browser/caching";
import {
  Annotation,
  LoadingStateType,
  MeasureData,
  PlotRange,
  TestBasics,
} from "../types";
import { generatePlottedDatasets } from "./dataset_generation";
import {
  annotateData,
  annotateSeries,
  calcAnnotationWidth,
} from "./generate_annotations";
import { plot } from "./plotting_helpers";

export async function eventLoop(
  startTimestamp: number,
  endTimestamp: number,
  datasets: string[],
  test_id: string,
  legend_sides: number[],
  plotColors: string[],
  displayed_samples: number,
  axesSets: number,
  setLoadingState: Setter<LoadingStateType>,
  setPlotRange: Setter<PlotRange>,
  testBasics: Accessor<TestBasics>,
  activeDatasets: Accessor<string[]>,
  measuring: Accessor<MeasureData>,
  setMeasurement: Setter<MeasureData>,
  annotations: Annotation[],
  setAnnotations: Setter<Annotation[]>,
  prefetch: boolean = false,
  annotation_ref: HTMLButtonElement,
  setCurrentAnnotation: Setter<Annotation | undefined>,
  annotationColor: string,
  annotationWidth: number,
) {
  const [generated_toPlot, generated_series] = await generatePlottedDatasets(
    datasets,
    startTimestamp,
    endTimestamp,
    test_id,
    legend_sides,
    plotColors,
    displayed_samples,
    setLoadingState,
    prefetch,
  );
  storeActiveDatasets(
    generated_toPlot,
    datasets,
    startTimestamp,
    endTimestamp,
    legend_sides,
  );
  const displayedAxes = generated_series.slice(1).map((s, i) => {
    const thing = s as Series;
    return thing.scale!;
  });
  if (!prefetch) {
    plot(
      annotateData(
        generated_toPlot,
        annotations,
        calcAnnotationWidth(generated_toPlot[0], annotationWidth),
      ),
      annotateSeries(generated_series, annotationColor),
      axesSets,
      setPlotRange,
      testBasics,
      activeDatasets,
      measuring,
      displayedAxes,
      setMeasurement,
      legend_sides,
      annotations,
      setAnnotations,
      setLoadingState,
      annotation_ref,
      setCurrentAnnotation,
    );
  }
}
