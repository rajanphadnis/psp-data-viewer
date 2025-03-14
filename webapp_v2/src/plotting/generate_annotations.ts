import { Setter } from "solid-js";
import uPlot, { AlignedData, Series } from "uplot";
import { delete_annotation_db, set_annotation } from "../db/db_interaction";
import { Annotation, type LoadingStateType } from "../types";

export function annotateData(
  actual_data: number[][],
  annotations: Annotation[],
  annotation_width: number = 6,
) {
  if (actual_data.length > 0) {
    const annotation_data_length = actual_data[0].length;
    let added = new Array<number>(annotation_data_length).fill(0);
    for (let a = 0; a < annotations.length; a++) {
      const annotation = annotations[a];
      const index_to_enter_at = actual_data[0].findIndex(
        (val, i) => val > annotation.timestamp_ms / 1000,
      );
      if (index_to_enter_at > 0) {
        const zeroes_start =
          index_to_enter_at - Math.floor(annotation_width / 2);
        const annotation_w_actual = annotation_width;
        const zeroes_end =
          annotation_data_length - annotation_w_actual - zeroes_start;
        const annotation_data: number[] = [
          ...Array(zeroes_start).fill(0),
          ...Array(annotation_w_actual).fill(1),
          ...Array(zeroes_end).fill(0),
        ];
        const added_temp = annotation_data.map(
          (num, index) => num + added[index],
        );
        added = added_temp;
      }
    }
    const annotated_data = [...actual_data, added];
    return annotated_data as AlignedData;
  } else {
    return [] as AlignedData;
  }
}

export function annotateSeries(series: ({} | Series)[]) {
  const annotated_series: Series[] = [
    ...series,
    {
      paths: uPlot.paths.bars!({
        size: [0.01, Infinity, 1],
        gap: 0,
      }),
      stroke: "green",
      fill: "green",
      scale: "annotation",
      label: " ",
      class: "hiddenLegendItem",
    },
  ];
  return annotated_series;
}

export function get_annotation(timestamp_s: number, annotations: Annotation[]) {
  const target_ms = timestamp_s * 1000;
  const annotation = annotations.reduce((closest, event) =>
    Math.abs(event.timestamp_ms - target_ms) <
    Math.abs(closest.timestamp_ms - target_ms)
      ? event
      : closest,
  );
  return annotation;
}

export function get_annotation_label(
  timestamp_s: number,
  annotations: Annotation[],
) {
  const annotation = get_annotation(timestamp_s, annotations);
  return `<div class="p-1 flex flex-col justify-start items-start"><p class="font-bold">${annotation.label}<p/><p>${annotation.notes}<p/></div>`;
}

export function create_annotation(
  uplot: uPlot,
  annotation_ref: HTMLButtonElement,
  setCurrentAnnotation: Setter<Annotation | undefined>,
) {
  const { left, top, idx } = uplot.cursor;
  let xVal = uplot.data[0][idx!];
  setCurrentAnnotation({
    label: "",
    notes: "",
    timestamp_ms: xVal * 1000,
  } as Annotation);
  annotation_ref.click();
  // await set_annotation(
  //   {
  //     label: "test",
  //     notes: "",
  //     timestamp_ms: xVal * 1000,
  //   } as Annotation,
  //   testID,
  //   setLoadingState,
  // );
}

export function delete_annotation(
  uplot: uPlot,
  annotations: Annotation[],
  annotation_ref: HTMLButtonElement,
  setCurrentAnnotation: Setter<Annotation | undefined>,
) {
  const { left, top, idx } = uplot.cursor;
  let xVal = uplot.data[0][idx!];
  const target_ms = xVal * 1000;
  const annotation = annotations.reduce((closest, event) =>
    Math.abs(event.timestamp_ms - target_ms) <
    Math.abs(closest.timestamp_ms - target_ms)
      ? event
      : closest,
  );
  setCurrentAnnotation(annotation);
  annotation_ref.click();
  // await delete_annotation_db(label.timestamp_ms, testID, setLoadingState);
}

export function calcAnnotationWidth(time: number[]): number {
  if (time) {
    // console.log(time);
    const num_of_data_points = time.length;
    const size = Math.ceil(num_of_data_points / 300);
    // console.log(`${num_of_data_points} -> ${size}`);
    return size;
  } else {
    return 0;
  }
}
