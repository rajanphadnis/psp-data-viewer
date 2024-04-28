import { Firestore, doc, getDoc, getDocFromCache } from "firebase/firestore";

export async function getSensorData(dataset: string, fromCache: boolean): Promise<[number[], number[], string]> {
  const docRef = doc(db, test_name, dataset);
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
  console.log(activeDatasets);
  return [time, data, scale];
}

export async function getTestInfo(): Promise<[string[], string, string]> {
  const docRef = doc(db, test_name, "general");
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
  return [datasets, name, test_article];
}

export async function getTestList(): Promise<string[]> {
  const docRef = doc(db, "general", "tests");
  let docSnap = await getDoc(docRef);
  const docData = docSnap.data()!;
  const tests: string[] = docData["tests"];
  return tests;
}