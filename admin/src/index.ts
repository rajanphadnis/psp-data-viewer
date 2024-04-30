import type { Firestore } from "firebase/firestore";
import { initFirebase } from "./firebase_init";
import { articleType, loadingStatus, type TestDetails } from "./types";
import { getTestArticles, getTests } from "./db_interaction";
import { generateArticlePanel, generateTestEntries, updateTestDisplay } from "./web_components";
import { updateStatus } from "./status";

declare global {
  var db: Firestore;
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var test_articles: string[];
  var gse_articles: string[];
  var tests: TestDetails[];
  var default_test: string;
  var selected_test: TestDetails;
}

initFirebase();

async function main() {
  await getTestArticles();
  [tests, default_test] = await getTests();
  selected_test = tests[0];
  updateTestDisplay();
  const test_article_button = document.getElementById("test_article_button")!;
  const gse_article_button = document.getElementById("gse_article_button")!;
  test_article_button.addEventListener("click", (e) => {
    generateArticlePanel(articleType.TEST);
  });
  gse_article_button.addEventListener("click", (e) => {
    generateArticlePanel(articleType.GSE);
  });
  generateArticlePanel(articleType.TEST);
  updateStatus(loadingStatus.DONE);
}

main();
