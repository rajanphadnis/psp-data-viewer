import uPlot, { AlignedData, Series } from "uplot";
import { Annotation } from "../types";

export function annotateData(actual_data: number[][], annotations: Annotation[], annotation_width: number = 6) {
  // (1728329398.0900002, 1)

  const annotation_data_length = actual_data[0].length;
  let added = new Array<number>(annotation_data_length).fill(0);
  //   const annotation_width = 10;

  for (let a = 0; a < annotations.length; a++) {
    const annotation = annotations[a];
    const index_to_enter_at = actual_data[0].findIndex((val, i) => val > annotation.timestamp_ms / 1000);
    if (index_to_enter_at > 0) {
      console.log(`${index_to_enter_at} of ${annotation_data_length}`);
      const zeroes_start = index_to_enter_at - Math.floor(annotation_width / 2);
      const annotation_w_actual = annotation_width;
      const zeroes_end = annotation_data_length - annotation_w_actual - zeroes_start;
      const annotation_data: number[] = [
        ...Array(zeroes_start).fill(0),
        ...Array(annotation_w_actual).fill(1),
        ...Array(zeroes_end).fill(0),
      ];
      const added_temp = annotation_data.map((num, index) => num + added[index]);
      added = added_temp;
      console.log(added_temp);
    }
  }
  const annotated_data = [...actual_data, added];
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

export function get_annotation_name(timestamp_s: number, annotations: Annotation[]) {
  console.log(annotations);
  const target_ms = timestamp_s * 1000;
  const label = annotations.reduce((closest, event) =>
    Math.abs(event.timestamp_ms - target_ms) < Math.abs(closest.timestamp_ms - target_ms) ? event : closest
  );
  return `${label.label}`;
}
