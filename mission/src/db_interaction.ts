import { DocumentSnapshot, doc, getDoc, getDocFromCache, type DocumentData } from "firebase/firestore";
import { collection, query, where, onSnapshot } from "firebase/firestore";




// /**
//  * Requests a list of datasets from the API, parses the result,
//  * and generates the associated plotting series
//  * 
//  * @param datasets The list of computer-readable datasets to fetch from the API
//  * @param startTimestamp The unix epoch timestamp indicating the start of the dataset period to get
//  * @param endTimestamp The unix epoch timestamp indicating the end of the dataset period to get
//  * @param channelsToFetch A list of all the channels to get (including cached channels)
//  *
//  * @returns A `Promise` that holds the list of: `toPlot`, `series`
//  *
//  */
// export async function getSensorData(
//   datasets: string[],
//   startTimestamp: number,
//   endTimestamp: number,
//   channelsToFetch: Map<string, number>
// ): Promise<[number[][], ({} | DatasetSeries)[]]> {

//   // Init empty variables
//   let toPlot: number[][] = [];
//   let series: ({} | DatasetSeries)[] = [];
//   let axes: DatasetAxis[] = [];
//   if (datasets.length == 0) {
//     // If there aren't any datasets to fetch, return empty lists
//     return [toPlot, series];
//   }

//   // Form the api request
//   let datasets_string: string = datasets.join(",");
//   let requestURL: string = `https://psp-api.rajanphadnis.com/api/get_data?id=${globalThis.test_id}&start=${startTimestamp}&end=${endTimestamp}&channels=${datasets_string}&max=${globalThis.displayedSamples}`;

//   // Send the request
//   var startQueryTime = performance.now();
//   return (await fetch(requestURL)).json().then((response) => {
//     var endQueryTime = performance.now();
//     console.log(`query took ${endQueryTime - startQueryTime} milliseconds`);

//     // For each dataset we requested, generate a series and add both the series and data to the main lists to return
//     for (let i = 0; i < datasets.length; i++) {
//       const dataset = datasets[i];

//       // the dataset takes the form `${nameOnly}__${scale}__`, so parse/split it up with the "__" characters
//       const nameOnly: string = dataset.split("__")[0];
//       const scale: string = dataset.split("__")[1];
//       let binExists: boolean = false;

//       // generate the plot series
//       const seriesToReturn = generateAxisAndSeries(scale, dataset, nameOnly, channelsToFetch.get(dataset)!);

//       // Add plot series and data to main lists to return
//       series.push(seriesToReturn);
//       toPlot.push(response[dataset]);
//     }

//     // add the "time" dataset to the data list to return
//     toPlot.push(response["time"]);

//     // return the main lists to return
//     return [toPlot, series];
//   });
// }

// /**
//  * Contacts the Firestore database and gets the document specific to the currently selected test.
//  * If the document already exists in the cache, automatically return that first. Otherwise,
//  * fetch the doc from the server and save to cache for future use.
//  *
//  * @returns A `Promise` that holds the list of: `datasets`, `name`, `test_article`, `gse_article`,
//  * `starting_timestamp`, `ending_timestamp`
//  *
//  */
// export async function getTestInfo(): Promise<[string[], string, string, string, number, number]> {
//   // Use the global (app state) database reference and currently selected test ID
//   const docRef = doc(globalThis.db, globalThis.test_id, "general");
//   let docSnap;

//   // Fetch document. Cache-first strategy
//   try {
//     docSnap = await getDocFromCache(docRef);
//   } catch (e) {
//     console.log("cache miss:", e);
//     docSnap = await getDoc(docRef);
//   }

//   // Read document data
//   const docData = docSnap.data()!;
//   const datasets: string[] = docData["azure_datasets"];
//   const name: string = docData["name"];
//   const test_article: string = docData["test_article"];
//   const gse_article: string = docData["gse_article"];
//   const initial_timestamp: number = docData["initial_timestamp"];
//   const starting_timestamp: number = parseInt(docData["starting_timestamp"]);
//   const ending_timestamp: number = parseInt(docData["ending_timestamp"]);

//   // return values
//   return [datasets, name, test_article, gse_article, starting_timestamp, ending_timestamp];
// }

// /**
//  * Contacts the Firestore database and gets the document `general/tests`.
//  * If the document already exists in the cache, automatically return that first. Otherwise,
//  * fetch the doc from the server and save to cache for future use.
//  *
//  * @returns A `Promise` that holds the list of `AllTests` and the default test id as a `string`
//  *
//  */
// export async function getGeneralInfo(): Promise<[AllTests[], string]> {
//   const docRef = doc(globalThis.db, "general", "tests");
//   let docSnap: DocumentSnapshot<DocumentData, DocumentData>;
//   try {
//     console.log("fetching metadata from cache");
//     docSnap = await getDocFromCache(docRef);
//   } catch (error) {
//     console.log("cache miss. Fetching metadata from server");
//     docSnap = await getDoc(docRef);
//   }

//   // Read document data
//   const docData = docSnap.data()!;
//   const tests_unsorted: AllTests[] = docData["visible"];

//   // sort the list of tests by their "initial timestamp" value (from smallest to largest)
//   const tests = tests_unsorted.sort((a, b) => (a.initial_timestamp > b.initial_timestamp ? -1 : 1));
//   const default_url: string = docData["default"];

//   // return values
//   return [tests, default_url];
// }
