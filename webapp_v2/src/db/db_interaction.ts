import {
  DocumentSnapshot,
  doc,
  getDoc,
  getDocFromCache,
  onSnapshot,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import type { Annotation, DatasetAxis, DatasetSeries, LoadingStateType, PlotRange, TestBasics } from "../types";
import { generateAxisAndSeries } from "../plotting/axes_series_generation";
import { Accessor, Setter } from "solid-js";
import { config } from "../generated_app_info";

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
  plotColors: string[],
  legendSidesToFetch: number[]
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
  let requestURL: string = `${config.urls.api_base_url}/api/get_data?id=${test_id}&start=${startTimestamp}&end=${endTimestamp}&channels=${datasets_string}&max=${displayed_samples}`;

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
        legendSidesToFetch[i]
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
export async function getTestInfo(
  test_ID: string,
  setTestBasics: Setter<TestBasics>,
  setPlotRange: Setter<PlotRange>
): Promise<void> {
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
  globalThis.default_id = default_id;
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
  console.log(default_test.name);
  window.history.pushState(null, default_test.name, `/${default_id}${window.location.search}`);

  // return
  return;
}

/**
 * Contacts the Firestore database and sets up a listener on the document `${testID}/annotations`.
 * If the document exists, onchange events trigger an update to the "annotations" state
 * within the app.
 *
 * @returns `Unsubscribe` type object that stops the annotation listener
 *
 */
export function startAnnotationListener(
  testID: string,
  setAnnotations: Setter<Annotation[]>,
  setLoadingState: Setter<LoadingStateType>
) {
  setLoadingState({ isLoading: true, statusMessage: "Fetching Annotations" });
  const docRef = doc(globalThis.db, testID, "annotations");
  const unsub = onSnapshot(
    docRef,
    (doc) => {
      console.log("Current data: ", doc.data());
      if (doc.exists()) {
        const data = doc.data();
        const timestamps_ms = Object.keys(data);
        let toSet = new Array<Annotation>();
        for (let a = 0; a < timestamps_ms.length; a++) {
          const timestamp_ms = timestamps_ms[a];
          const title = data[timestamp_ms]["title"] ?? "";
          const notes = data[timestamp_ms]["notes"] ?? "";
          const toAdd: Annotation = {
            timestamp_ms: parseFloat(timestamp_ms),
            label: title,
            notes: notes,
          };
          toSet.push(toAdd);
        }
        console.log(toSet);
        setAnnotations(toSet);
      }
    },
    (error) => {
      console.error(error);
      setLoadingState({ isLoading: false, statusMessage: "Failed: Annotation Listener" });
    }
  );
  return unsub;
}

export async function set_annotation(
  newAnnotation: Annotation,
  testID: string,
  setLoadingState: Setter<LoadingStateType>
) {
  setLoadingState({ isLoading: true, statusMessage: "Creating Annotation" });
  const docRef = doc(globalThis.db, testID, "annotations");
  let toSetObj: any = {};
  toSetObj[`${newAnnotation.timestamp_ms}`] = {
    title: newAnnotation.label ?? "",
    notes: newAnnotation.notes ?? "",
  };
  await setDoc(docRef, toSetObj, { merge: true });
  setLoadingState({ isLoading: false, statusMessage: "" });
}
