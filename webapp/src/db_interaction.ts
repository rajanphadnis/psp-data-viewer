import { Firestore, doc, getDoc, getDocFromCache } from "firebase/firestore";
import type { AllTests } from "./types";

export async function getSensorData(dataset: string, fromCache: boolean): Promise<[number[], number[], string]> {
  const docRef = doc(db, test_id, dataset);
  let docSnap;
  if (fromCache) {
    try {
      docSnap = await getDocFromCache(docRef);
    } catch (e) {
      console.log("cache miss:", e);
      docSnap = await getDoc(docRef);
    }
  } else {
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  const time: number[] = docData["time"];
  const data: number[] = docData["data"];
  const scale: string = docData["unit"];
  activeDatasets.cached.push(dataset);
  return [time, data, scale];
}

export async function getTestInfo(): Promise<[string[], string, string, string, number]> {
  const docRef = doc(db, test_id, "general");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  const datasets: string[] = docData["datasets"];
  const name: string = docData["name"];
  const test_article: string = docData["test_article"];
  const gse_article: string = docData["gse_article"];
  const initial_timestamp: number = docData["initial_timestamp"]
  return [datasets, name, test_article, gse_article, initial_timestamp];
}

export async function getGeneralTestInfo(): Promise<[AllTests[], string]> {
  const docRef = doc(db, "general", "tests");
  let docSnap = await getDoc(docRef);
  const docData = docSnap.data()!;
  const tests_unsorted: AllTests[] = docData["visible"];
  const tests = tests_unsorted.sort((a, b) => (a.initial_timestamp > b.initial_timestamp ? -1 : 1));
  const default_url: string = docData["default"];
  return [tests, default_url];
}