import { Accessor, Setter } from "solid-js";
import { AccessControlDoc, PermissionType, TestBasics, TestData } from "../types";
import {
  doc,
  getDocFromCache,
  getDoc,
  DocumentSnapshot,
  DocumentData,
  query,
  updateDoc,
  FieldValue,
  arrayRemove,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { decode, encode } from "./firebase-encode";

/**
 * Contacts the Firestore database and gets the document specific to the currently selected test.
 * If the document already exists in the cache, automatically return that first. Otherwise,
 * fetch the doc from the server and save to cache for future use.
 *
 * @returns A `Promise` that holds the list of: `datasets`, `name`, `test_article`, `gse_article`,
 * `starting_timestamp`, `ending_timestamp`
 *
 */
export async function getTestInfo(test_ID: string, setTestBasics: Setter<TestData>): Promise<TestData> {
  // Use the global (app state) database reference and currently selected test ID
  const docRef = doc(globalThis.db, test_ID, "general");
  let docSnap;

  // Fetch document. Cache-first strategy
  // try {
  // docSnap = await getDocFromCache(docRef);
  // } catch (e) {
  // console.log("cache miss:", e);
  docSnap = await getDoc(docRef);
  // }

  // Read document data
  const docData = docSnap.data()!;
  const datasets: string[] = docData["azure_datasets"];
  const name: string = docData["name"];
  const test_article: string = docData["test_article"];
  const gse_article: string = docData["gse_article"];
  const starting_timestamp: number = parseInt(docData["starting_timestamp"]);
  const ending_timestamp: number = parseInt(docData["ending_timestamp"]);
  const toReturn: TestData = {
    id: test_ID,
    name: name,
    test_article: test_article,
    gse_article: gse_article,
    starting_timestamp: starting_timestamp,
    ending_timestamp: ending_timestamp,
    datasets: datasets.sort((a, b) => a.localeCompare(b)),
  };
  setTestBasics(toReturn);

  // setAllDatasets(datasets.sort((a, b) => a.localeCompare(b)));

  // const initial_timestamp: number = docData["initial_timestamp"];
  // const starting_timestamp: number = parseInt(docData["starting_timestamp"]);
  // const ending_timestamp: number = parseInt(docData["ending_timestamp"]);

  // setPlotRange({ start: starting_timestamp, end: ending_timestamp });

  console.log("got test-specific data");

  // return
  return toReturn;
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
  setAllKnownTests: Setter<TestBasics[]>,
  setDefaultTest: Setter<string>
): Promise<void> {
  const docRef = doc(globalThis.db, "general", "tests");
  let docSnap: DocumentSnapshot<DocumentData, DocumentData>;
  // try {
  //   console.log("fetching metadata from cache");
  //   docSnap = await getDocFromCache(docRef);
  // } catch (error) {
  // console.log("cache miss. Fetching metadata from server");
  docSnap = await getDoc(docRef);
  // }

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
  // globalThis.default_id = default_id;
  setDefaultTest(default_id);
  setAllKnownTests([...tests]);
  return;
}

export async function getDefaultArticles(
  setDefaultTestArticle: Setter<string>,
  setDefaultGSE: Setter<string>
): Promise<void> {
  const docRef = doc(globalThis.db, "general", "articles");
  let docSnap: DocumentSnapshot<DocumentData, DocumentData>;
  // try {
  //   console.log("fetching metadata from cache");
  //   docSnap = await getDocFromCache(docRef);
  // } catch (error) {
  // console.log("cache miss. Fetching metadata from server");
  docSnap = await getDoc(docRef);
  // }

  // Read document data
  const docData = docSnap.data()!;
  const default_gse: string = docData["default_gse"];
  const default_test_article: string = docData["default_test"];

  setDefaultTestArticle(default_test_article);
  setDefaultGSE(default_gse);
  return;
}

export async function fetchOrgPermissions(org: string) {
  const docRef = doc(globalThis.adminDB, "access_control", "users");
  const docSnap = await getDoc(docRef);
  const dat = docSnap.data()! as AccessControlDoc;
  let toReturn: AccessControlDoc = {};
  const keys = Object.keys(dat);
  keys.forEach((key) => {
    const list = dat[key].filter((val) => {
      return val.includes(org);
    });
    if (list.length > 0) {
      toReturn[key] = list;
    }
  });
  console.log(toReturn);
  return toReturn;
}

export async function deletePermission(email: string, permission: string) {
  const docRef = doc(globalThis.adminDB, "access_control", "users");
  let obj: any = {};
  obj[email] = arrayRemove(permission);
  await setDoc(docRef, obj, { merge: true });
  return true;
}

export async function addPermission(email: string, permission: string) {
  const docRef = doc(globalThis.adminDB, "access_control", "users");
  let obj: any = {};
  obj[email] = arrayUnion(permission);
  await setDoc(docRef, obj, { merge: true });
  return true;
}

export async function fetchAvailablePermissions(org: string) {
  const permsDoc = doc(globalThis.adminDB, "access_control", "permissions");
  const snap = await getDoc(permsDoc);
  const permissions = snap.data() as PermissionType;
  return permissions;
}
