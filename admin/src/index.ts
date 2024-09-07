import type { Firestore } from "firebase/firestore";
import { initFirebase } from "./firebase_init";
import { articleType, loadingStatus, type TestDetails } from "./types";
import { getTestArticles, getTests } from "./db_interaction";
import { generateArticlePanel, generateTestEntries, loader, updateTestDisplay } from "./web_components";
import { updateStatus } from "./status";
import { httpsCallable, type Functions } from "firebase/functions";
import { updateTests } from "./tests";
import { initModal } from "./modal";
import { newTest } from "./new-test/new";
import type { FirebaseStorage } from "firebase/storage";
import { instanceManager } from "./instances/manager";

declare global {
  var db: Firestore;
  var functions: Functions;
  var storage: FirebaseStorage;
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var test_articles: string[];
  var gse_articles: string[];
  var tests: TestDetails[];
  var default_test: string;
  var selected_test: TestDetails;
}

initFirebase();
if (!("Proxy" in window)) {
  console.warn("Your browser doesn't support Proxies. Some features may not work properly.");
}

async function main() {
  await getTestArticles();
  updateTests();
  const test_article_button = document.getElementById("test_article_button")! as HTMLButtonElement;
  const gse_article_button = document.getElementById("gse_article_button")! as HTMLButtonElement;
  const analytics_button = document.getElementById("analytics_button")! as HTMLButtonElement;
  const instance_button = document.getElementById("instance_button")! as HTMLButtonElement;
  const newTestSaveButton = document.getElementById("new_test_save")! as HTMLButtonElement;
  test_article_button.addEventListener("click", (e) => {
    generateArticlePanel(articleType.TEST);
  });
  gse_article_button.addEventListener("click", (e) => {
    generateArticlePanel(articleType.GSE);
  });
  newTestSaveButton.addEventListener("click", (e) => {
    updateStatus(loadingStatus.LOADING);
    newTestSaveButton.disabled = true;
    newTestSaveButton.innerHTML = loader;
    const createTest = httpsCallable(functions, "createTest");
    const test_id = document.getElementById("new_test_id")! as HTMLInputElement;
    const test_name = document.getElementById("new_test_name")! as HTMLInputElement;
    const test_article = document.getElementById("new_test_test_article")! as HTMLSelectElement;
    const gse_article = document.getElementById("new_test_gse_article")! as HTMLSelectElement;
    const trim_to = document.getElementById("new_test_trim")! as HTMLInputElement;
    const entries = document.getElementsByClassName("url_list_div")!.length;
    let trim_to_s: number = 0;
    let isnum = /^\d+$/.test(trim_to.value);
    if (isnum) {
      trim_to_s = parseInt(trim_to.value);
    }
    let url_pairs: string[] = [];
    for (let i = 0; i < entries; i++) {
      const element = document.getElementById("url_list_div_textinput_" + i)! as HTMLInputElement;
      url_pairs.push(element.value);
    }
    const payload = {
      test_name: test_name.value,
      test_id: test_id.value,
      test_article: test_article.value,
      gse_article: gse_article.value,
      url_pairs: url_pairs,
      trim_to_s: trim_to_s.toString(),
    };
    console.log(payload);
    createTest(payload).then(async (result) => {
      const data: any = result.data;
      // const message = data.csv_fields;
      console.log(data);
      // updateStatus(loadingStatus.DONE);
      // csvButton.innerHTML = check_mark;
      // await delay(1500);
      // csvButton.innerHTML = '<span class="material-symbols-outlined">table_view</span>';
      updateStatus(loadingStatus.DONE);
    });
  });
  analytics_button.addEventListener("click", (e) => {
    window.location.pathname = "analytics";
  });
  instance_button.addEventListener("click", (e) => {
    window.location.pathname = "instances";
  });
  generateArticlePanel(articleType.TEST);
  updateStatus(loadingStatus.DONE);
}

if (location.pathname.includes("/new/")) {
  newTest();
} else {
  if (location.pathname.includes("/instances/")) {
    instanceManager();
  } else {
    initModal();
    main();
  }
}
