import type { Firestore } from "firebase/firestore";
import { initFirebase } from "./firebase_init";
import type { TestDetails } from "./types";
import { getTestArticles, getTests } from "./db_interaction";
import { generateTestEntries } from "./web_components";

declare global {
  var db: Firestore;
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var test_articles: string[];
  var gse_articles: string[];
  var tests: TestDetails[];
  var default_test: string;
}

initFirebase();

async function main() {
  await getTestArticles();
  [tests, default_test] = await getTests();
  generateTestEntries();
}

main();
