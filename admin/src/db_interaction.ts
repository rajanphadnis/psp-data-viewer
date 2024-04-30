import { doc, getDoc, getDocFromCache } from "firebase/firestore";
import type { TestDetails } from "./types";

export async function getTestArticles(): Promise<void> {
  const docRef = doc(db, "general", "articles");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  gse_articles = docData["gse"];
  test_articles = docData["test"];
}

export async function getTests(): Promise<[TestDetails[], string]> {
  const docRef = doc(db, "general", "tests");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  const default_test: string = docData["default"];
  const test_articles: TestDetails[] = docData["visible"];
  return [test_articles, default_test];
}

export async function getSpecificTest(id:string) {
  const docRef = doc(db, id, "general");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  const gse_article: string = docData["gse_article"];
  const test_article: string = docData["test_article"];
  const name: string = docData["name"];
  const datasets: string[] = docData["datasets"];
  const toReturn: TestDetails = {
    id: id,
    name: name,
    gse_article: gse_article,
    test_article: test_article,
    datasets: datasets
  }
  return toReturn;
}