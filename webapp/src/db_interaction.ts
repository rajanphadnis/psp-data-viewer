import { Firestore, doc, getDoc, getDocFromCache } from "firebase/firestore";
import type { AllTests } from "./types";
import { QueryCommand, TimestreamQueryClient, type QueryCommandOutput } from "@aws-sdk/client-timestream-query";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { datasetPlottingColors } from "./theming";
import { legendRound } from "./plotting_helpers";

export async function getSensorData(
  datasets: string[],
  startTimestamp: number | undefined = undefined,
  endTimestamp: number | undefined = undefined
): Promise<
  [
    number[][],
    (
      | {}
      | {
          label: string;
          value: (self: any, rawValue: number) => string;
          stroke: string;
          width: number;
          scale: string;
          spanGaps: boolean;
        }
    )[]
  ]
> {
  let returnedData: QueryCommandOutput;
  var headers: string[] = [];
  let toPlot: number[][] = [[], []];
  let series: (
    | {}
    | {
        label: string;
        value: (self: any, rawValue: number) => string;
        stroke: string;
        width: number;
        scale: string;
        spanGaps: boolean;
      }
  )[] = [{}];
  if (datasets.length == 0) {
    return [toPlot, series];
  }
  // const awsDatasetName: string = `${dataset}__${dataset_units}__`;
  let datasets_string: string = '"' + datasets.join('","') + '"';
  const query = `SELECT time,${datasets_string} FROM "sampleDB"."whoopsie" WHERE time BETWEEN from_milliseconds(1714539480000) and from_milliseconds(1714539680000) ORDER BY time ASC LIMIT 1000`;
  console.log(query);
  const queryCommand = new QueryCommand({ QueryString: query });

  try {
    const data = await globalThis.timestreamQuery.send(queryCommand);
    if (data.Rows!.length == 0) {
      return [toPlot, series];
    }
    var startTime = performance.now();
    console.log(data);
    console.log(data.NextToken);
    for (let i = 0; i < data.ColumnInfo!.length; i++) {
      const headerName = data.ColumnInfo![i].Name!;
      headers.push(headerName);
      if (headerName != "time") {
        const nameOnly: string = headerName.split("__")[0];
        const scale: string = headerName.split("__")[1];
        series.push({
          label: nameOnly,
          value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
          stroke: datasetPlottingColors[i],
          width: 2,
          scale: scale,
          spanGaps: true,
        });
      }
    }
    for (let i = 0; i < data.Rows![0].Data!.length; i++) {
      toPlot[i] = [];
    }
    for (let i = 0; i < data.Rows!.length; i++) {
      const rowData = data.Rows![i].Data;
      for (let j = 0; j < rowData!.length; j++) {
        let elementData: number;
        if (headers[j] == "time") {
          elementData = parseFloat((new Date(rowData![j].ScalarValue!).getTime() / 1000).toFixed(3));
        } else {
          elementData = parseFloat(rowData![j].ScalarValue!);
        }
        toPlot[j].push(elementData);
      }
    }
    var endTime = performance.now();
    console.log(`post processing took ${endTime - startTime} milliseconds`);
  } catch (error) {
    // error handling.
    console.error(error);
  } finally {
    // finally.
    // if(toPlot.length != 0) {
    console.log([toPlot, series]);
    return [toPlot, series];

    // }
  }

  // toPlot[0] = time;
  // toPlot.push(data);
  // series.push({
  //   label: dataset,
  //   value: (self: any, rawValue: number) => legendRound(rawValue, " " + scale),
  //   stroke: datasetPlottingColors[i],
  //   width: 2,
  //   scale: scale,
  //   spanGaps: true,
  // });
  // return [time, data, scale];
}

export async function getTestInfo(): Promise<[string[], string, string, string, number]> {
  const docRef = doc(globalThis.db, globalThis.test_id, "general");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  const datasets: string[] = docData["aws_datasets"];
  const name: string = docData["name"];
  const test_article: string = docData["test_article"];
  const gse_article: string = docData["gse_article"];
  const initial_timestamp: number = docData["initial_timestamp"];
  return [datasets, name, test_article, gse_article, initial_timestamp];
}

export async function getGeneralTestInfo(): Promise<[AllTests[], string]> {
  const docRef = doc(globalThis.db, "general", "tests");
  let docSnap = await getDoc(docRef);
  const docData = docSnap.data()!;
  const tests_unsorted: AllTests[] = docData["visible"];
  const tests = tests_unsorted.sort((a, b) => (a.initial_timestamp > b.initial_timestamp ? -1 : 1));
  const default_url: string = docData["default"];
  return [tests, default_url];
}
