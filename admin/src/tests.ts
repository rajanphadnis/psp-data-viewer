import { doc, getDoc } from "firebase/firestore";
import { updateStatus } from "./status";
import { loadingStatus, type TestDetails } from "./types";
import { getTests } from "./db_interaction";
import { updateTestDisplay } from "./web_components";

export async function updateTests(cache: boolean = true) {
  [globalThis.tests, globalThis.default_test] = await getTests(cache);
  globalThis.tests.sort(function (a, b) {
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
  selected_test = tests[0];
  updateTestDisplay(cache);
}

export async function saveTestData(
  test_id: string,
  new_id: string,
  new_name: string,
  new_gse: string,
  new_test_article: string
) {
  updateStatus(loadingStatus.LOADING);
  const generalDocRef = doc(db, "general", "tests");
  const docRef = doc(db, test_id, "general");
  const generalSnap = await getDoc(generalDocRef);
  const docData = generalSnap.data()!;
  const test_articles: TestDetails[] = docData["visible"];
  let new_list = [];
  test_articles.forEach((test_article) => {
    if (test_article.id === test_id) {
      console.log(new_gse);
      console.log(new_test_article);
    } else {
      new_list.push({
        id: test_article.id,
        name: test_article.name,
        gse_article: test_article.gse_article,
        test_article: test_article.test_article,
      });
    }
  });
  const dataToWrite = {
    id: test_id,
    name: new_name,
    gse_article: new_gse,
    test_article: new_test_article,
  };
  new_list.push(dataToWrite);
  (await fetch(`https://psp-api.rajanphadnis.com/api/get_database_info?id=${test_id}`))
    .json()
    .then(async (response) => {
      (
        await fetch(
          `https://updatetestmetadata-w547ikcrwa-uc.a.run.app/?id=${test_id}&name=${new_name}&article=${new_test_article}&gse=${new_gse}`
        )
      )
        .json()
        .then((re) => {
          console.log("completed doc update");
          console.log(re);
          updateTests(false);
          window.location.href = window.location.href;
        updateStatus(loadingStatus.DONE);
        });
    });
}
