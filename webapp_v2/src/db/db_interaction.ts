import { DocumentSnapshot, doc, getDoc, getDocFromCache, type DocumentData } from "firebase/firestore";
import type { DatasetAxis, DatasetSeries, PlotRange, TestBasics } from "../types";
import { generateAxisAndSeries } from "../plotting/axes_series_generation";
import { Accessor, Setter } from "solid-js";

/**
 * Requests a list of datasets from the API, parses the result,
 * and generates the associated plotting series
 *
 * @param datasets The list of computer-readable datasets to fetch from the API
 * @param startTimestamp The unix epoch timestamp indicating the start of the dataset period to get
 * @param endTimestamp The unix epoch timestamp indicating the end of the dataset period to get
 * @param channelsToFetch A list of all the channels to get (including cached channels)
 *
 * @returns A `Promise` that holds the list of: `toPlot`, `series`
 *
 */
export async function getSensorData(
  datasets: string[],
  startTimestamp: number,
  endTimestamp: number,
  channelsToFetch: Map<string, number>,
  test_id: string,
  displayed_samples: number,
  plotColors: string[]
  // indexOfDatasetList: number,
): Promise<[number[][], ({} | DatasetSeries)[]]> {
  // Init empty variables
  let toPlot: number[][] = [];
  let series: ({} | DatasetSeries)[] = [];
  let axes: DatasetAxis[] = [];
  if (datasets.length == 0) {
    // If there aren't any datasets to fetch, return empty lists
    return [toPlot, series];
  }

  // Form the api request
  let datasets_string: string = datasets.join(",");
  let requestURL: string = `https://psp-api.rajanphadnis.com/api/get_data?id=${test_id}&start=${startTimestamp}&end=${endTimestamp}&channels=${datasets_string}&max=${displayed_samples}`;

  // Send the request
  var startQueryTime = performance.now();
  return (await fetch(requestURL)).json().then((response) => {
    var endQueryTime = performance.now();
    console.log(`query took ${endQueryTime - startQueryTime} milliseconds`);

    // For each dataset we requested, generate a series and add both the series and data to the main lists to return
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];

      // the dataset takes the form `${nameOnly}__${scale}__`, so parse/split it up with the "__" characters
      const nameOnly: string = dataset.split("__")[0];
      const scale: string = dataset.split("__")[1];
      let binExists: boolean = false;

      // generate the plot series
      const seriesToReturn = generateAxisAndSeries(
        scale,
        dataset,
        nameOnly,
        channelsToFetch.get(dataset)!,
        plotColors,
        1
      );

      // Add plot series and data to main lists to return
      series.push(seriesToReturn);
      toPlot.push(response[dataset]);
    }

    // add the "time" dataset to the data list to return
    toPlot.push(response["time"]);

    // return the main lists to return
    return [toPlot, series];
  });
}

/**
 * Contacts the Firestore database and gets the document specific to the currently selected test.
 * If the document already exists in the cache, automatically return that first. Otherwise,
 * fetch the doc from the server and save to cache for future use.
 *
 * @returns A `Promise` that holds the list of: `datasets`, `name`, `test_article`, `gse_article`,
 * `starting_timestamp`, `ending_timestamp`
 *
 */
export async function getTestInfo(test_ID: string, setTestBasics: Setter<TestBasics>, setPlotRange: Setter<PlotRange>): Promise<void> {
  // Use the global (app state) database reference and currently selected test ID
  const docRef = doc(globalThis.db, test_ID, "general");
  let docSnap;

  // Fetch document. Cache-first strategy
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }

  // Read document data
  const docData = docSnap.data()!;
  const datasets: string[] = docData["azure_datasets"];
  const name: string = docData["name"];
  const test_article: string = docData["test_article"];
  const gse_article: string = docData["gse_article"];
  const starting_timestamp: number = parseInt(docData["starting_timestamp"]);
  const ending_timestamp: number = parseInt(docData["ending_timestamp"]);
  setTestBasics({
    id: test_ID,
    name: name,
    test_article: test_article,
    gse_article: gse_article,
    starting_timestamp: starting_timestamp,
    ending_timestamp: ending_timestamp,
    datasets: datasets.sort((a, b) => a.localeCompare(b)),
  });

  // setAllDatasets(datasets.sort((a, b) => a.localeCompare(b)));

  // const initial_timestamp: number = docData["initial_timestamp"];
  // const starting_timestamp: number = parseInt(docData["starting_timestamp"]);
  // const ending_timestamp: number = parseInt(docData["ending_timestamp"]);

  setPlotRange({ start: starting_timestamp, end: ending_timestamp });

  console.log("got test-specific data");

  // return
  return;
}

/**
 * Contacts the Firestore database and gets the document `general/tests`.
 * If the document already exists in the cache, automatically return that first. Otherwise,
 * fetch the doc from the server and save to cache for future use.
 *
 * @returns A `Promise` that holds the list of `AllTests` and the default test id as a `string`
 *
 */
export async function getGeneralTestInfo(
  page_testID: string,
  setAllKnownTests: Setter<TestBasics[]>,
  setTestBasics: Setter<TestBasics>,
  testBasics: Accessor<TestBasics>
): Promise<void> {
  const docRef = doc(globalThis.db, "general", "tests");
  let docSnap: DocumentSnapshot<DocumentData, DocumentData>;
  try {
    console.log("fetching metadata from cache");
    docSnap = await getDocFromCache(docRef);
  } catch (error) {
    console.log("cache miss. Fetching metadata from server");
    docSnap = await getDoc(docRef);
  }

  // Read document data
  const docData = docSnap.data()!;
  const tests_unsorted: TestBasics[] = docData["visible"];

  // sort the list of tests by their "initial timestamp" value (from smallest to largest)
  // const tests = tests_unsorted.sort((a, b) => (a.starting_timestamp > b.starting_timestamp ? -1 : 1));
  const tests = tests_unsorted.sort(function (a, b) {
    if (a.test_article === b.test_article) {
      if (a.gse_article === b.gse_article) {
        return b.name < a.name ? 1 : -1;
      } else if (a.gse_article < b.gse_article) {
        return 1;
      } else if (a.gse_article < b.gse_article) {
        return -1;
      }
    } else if (a.test_article < b.test_article) {
      return 1;
    } else if (a.test_article < b.test_article) {
      return -1;
    }
    return -1;
  });
  const default_id: string = docData["default"];
  setAllKnownTests(tests);

  if (page_testID != undefined) {
    const known_test = tests.find((p) => p.id == page_testID);
    if (known_test != undefined) {
      setTestBasics(known_test);
      return;
    }
  }
  const default_test = tests.find((p) => p.id == default_id)!;
  setTestBasics(default_test);
  console.log(testBasics().name);
  window.history.pushState(null, testBasics().name, `/${default_id}${window.location.search}`);

  // return
  return;
}