import type { Firestore } from "firebase/firestore";
import { initFirebase } from "./firebase_init";
import { articleType, loadingStatus, type TestDetails } from "./types";
import { getTestArticles, getTests } from "./db_interaction";
import { check_mark, generateArticlePanel, generateTestEntries, updateTestDisplay } from "./web_components";
import { updateStatus } from "./status";
import { httpsCallable, type Functions } from "firebase/functions";

declare global {
  var db: Firestore;
  var functions: Functions;
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
  const sharelinkButton = document.getElementById("sharelinkButton")!;
  test_article_button.addEventListener("click", (e) => {
    generateArticlePanel(articleType.TEST);
  });
  gse_article_button.addEventListener("click", (e) => {
    generateArticlePanel(articleType.GSE);
  });
  sharelinkButton.addEventListener("click", (e) => {
    const createTest = httpsCallable(functions, "createTest");
    createTest({ test_name: "tessst", url_pair: ["test1", "test2"] }).then(async (result) => {
      const data: any = result.data;
      // const message = data.csv_fields;
      console.log(data);
      // updateStatus(loadingStatus.DONE);
      // csvButton.innerHTML = check_mark;
      // await delay(1500);
      // csvButton.innerHTML = '<span class="material-symbols-outlined">table_view</span>';
    });
  });
  generateArticlePanel(articleType.TEST);
  updateStatus(loadingStatus.DONE);
}

main();
