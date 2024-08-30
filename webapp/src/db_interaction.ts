import {
  DocumentSnapshot,
  doc,
  getDoc,
  getDocFromCache,
  type DocumentData,
} from "firebase/firestore";
import type { AllTests, DatasetAxis, DatasetSeries } from "./types";
import { generateAxisAndSeries } from "./plotting/axes_series_generation";

export async function getSensorData(
  datasets: string[],
  startTimestamp: number,
  endTimestamp: number,
  channelsToFetch: Map<string, number>
): Promise<[number[][], ({} | DatasetSeries)[], DatasetAxis[]]> {
  let toPlot: number[][] = [];
  let series: ({} | DatasetSeries)[] = [];
  let axes: DatasetAxis[] = [];
  if (datasets.length == 0) {
    return [toPlot, series, axes];
  }
  let datasets_string: string = datasets.join(",");
  let requestURL: string = `https://psp-api.rajanphadnis.com/api/get_data?id=${globalThis.test_id}&start=${startTimestamp}&end=${endTimestamp}&channels=${datasets_string}&max=${globalThis.displayedSamples}`;

  var startQueryTime = performance.now();
  return (await fetch(requestURL)).json().then((response) => {
    var endQueryTime = performance.now();
    console.log(`query took ${endQueryTime - startQueryTime} milliseconds`);

    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      const nameOnly: string = dataset.split("__")[0];
      const scale: string = dataset.split("__")[1];
      let binExists: boolean = false;
      const [seriesToReturn, axisToReturn] = generateAxisAndSeries(
        scale,
        dataset,
        nameOnly,
        channelsToFetch.get(dataset)!
      );
      series.push(seriesToReturn);
      axes.push(axisToReturn);
      toPlot.push(response[dataset]);
    }
    toPlot.push(response["time"]);
    return [toPlot, series, axes];
  });
}

export async function getTestInfo(): Promise<[string[], string, string, string, number, number]> {
  const docRef = doc(globalThis.db, globalThis.test_id, "general");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  const datasets: string[] = docData["azure_datasets"];
  const name: string = docData["name"];
  const test_article: string = docData["test_article"];
  const gse_article: string = docData["gse_article"];
  const initial_timestamp: number = docData["initial_timestamp"];
  const starting_timestamp: number = parseInt(docData["starting_timestamp"]);
  const ending_timestamp: number = parseInt(docData["ending_timestamp"]);
  return [datasets, name, test_article, gse_article, starting_timestamp, ending_timestamp];
}

export async function getGeneralTestInfo(): Promise<[AllTests[], string]> {
  const docRef = doc(globalThis.db, "general", "tests");
  let docSnap: DocumentSnapshot<DocumentData, DocumentData>;
  try {
    console.log("fetching metadata from cache");
    docSnap = await getDocFromCache(docRef);
  } catch (error) {
    console.log("cache miss. Fetching metadata from server");
    docSnap = await getDoc(docRef);
  }
  // = await getDoc(docRef);
  const docData = docSnap.data()!;
  const tests_unsorted: AllTests[] = docData["visible"];
  const tests = tests_unsorted.sort((a, b) => (a.initial_timestamp > b.initial_timestamp ? -1 : 1));
  const default_url: string = docData["default"];
  return [tests, default_url];
}
