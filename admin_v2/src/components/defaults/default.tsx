import { Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { useState } from "../../state";
import SectionTitle from "../title";
import { TestBasics } from "../../types";
import styles from "./defaults.module.css";
import DefaultDropdown from "./dropdown";
import { writeBatch, doc } from "firebase/firestore";

const DefaultPage: Component<{}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
  ]: any = useState();

  const [testID, setTestID] = createSignal<string>(defaultTest());
  const [gseArticle, setGseArticle] = createSignal<string>(defaultGSE());
  const [testArticle, setTestArticle] = createSignal<string>(defaultTestArticle());
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  const availableTestIDs = createMemo(() => {
    return allKnownTests().map((test: TestBasics) => test.id);
  });

  const availableGSE = createMemo<string[]>(() => {
    const set = new Set<string>(allKnownTests().map((test: TestBasics) => test.gse_article));
    const arr = [...set];
    return arr;
  });

  const availableTestArticles = createMemo<string[]>(() => {
    const set = new Set<string>(allKnownTests().map((test: TestBasics) => test.test_article));
    const arr = [...set];
    return arr;
  });

  const is_changed = createMemo(() => {
    const idChange = !(testID() == defaultTest() || testID() == "");
    const gseChange = !(gseArticle() == defaultGSE() || gseArticle() == "");
    const testChange = !(testArticle() == defaultTestArticle() || testArticle() == "");
    const is_changed = idChange || gseChange || testChange;
    return is_changed;
  });

  const is_empty = createMemo(() => {
    const idEmpty = testID() == "";
    const gseEmpty = gseArticle() == "";
    const testEmpty = testArticle() == "";
    const is_empty = idEmpty || gseEmpty || testEmpty;
    return is_empty;
  });

  createEffect(() => {
    setTestID(defaultTest());
    setGseArticle(defaultGSE());
    setTestArticle(defaultTestArticle());
  });

  createEffect(() => {
    console.log("run");
    if (is_empty()) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  });

  return (
    <Show when={!isLoading()} fallback={<div class={styles.defaultsLoader}></div>}>
      <SectionTitle title="Application Defaults" />
      <DefaultDropdown
        onChange={setTestID}
        optionVals={availableTestIDs}
        default={defaultTest}
        name="Test"
        isID={true}
      />
      <br />
      <DefaultDropdown onChange={setGseArticle} optionVals={availableGSE} default={defaultGSE} name="GSE Article" />
      <br />
      <DefaultDropdown
        onChange={setTestArticle}
        optionVals={availableTestArticles}
        default={defaultTestArticle}
        name="Test Article"
      />
      <br />
      <Show when={is_changed()}>
        <button
          class={styles.saveDefaultsButton}
          on:click={async () => {
            const article_payload = {
              default_gse: gseArticle(),
              default_test: testArticle(),
            };
            const test_payload = {
              default: testID(),
            };
            console.log(article_payload);
            console.log(test_payload);

            const batch = writeBatch(globalThis.db);
            const articlesRef = doc(globalThis.db, "general", "articles");
            const testsRef = doc(globalThis.db, "general", "tests");
            batch.set(articlesRef, article_payload, { merge: true });
            batch.set(testsRef, test_payload, { merge: true });
            setLoadingState({ isLoading: true, statusMessage: "Saving..." });
            setIsLoading(true);
            await batch.commit();
            // setIsLoading(false);
            // setLoadingState({ isLoading: false, statusMessage: "" });
            location.reload();
          }}
        >
          Save Changes
        </button>
      </Show>
    </Show>
  );
};

export default DefaultPage;
