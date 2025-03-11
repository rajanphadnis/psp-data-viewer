import { Accessor, Component, Setter } from "solid-js";
import styles from "./editor.module.css";
import { useState } from "../../../state";
import { TestData } from "../../../types";
import { getGeneralTestInfo } from "../../../db/db_interaction";
import { httpsCallable } from "firebase/functions";
import { config } from "../../../generated_app_check_secret";

const EditorSaveButton: Component<{
  testData: Accessor<TestData>;
  name: Accessor<string>;
  testArticle: Accessor<string>;
  gseArticle: Accessor<string>;
  setloading: Setter<boolean>;
}> = (props) => {
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
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();

  return (
    <button
      class={styles.inputSave}
      on:click={async () => {
        props.setloading(true);

        const update_metadata = httpsCallable(globalThis.functions, "update_test_metadata");
        update_metadata({
          id: props.testData().id,
          name: props.name(),
          article: props.testArticle(),
          gse: props.gseArticle(),
          db_id: (config as any)[org()!].firebase.databaseID,
          slug: org()!,
        }).then(async (result) => {
          console.log("completed doc update");
          console.log(result);
          await getGeneralTestInfo(setAllKnownTests, setDefaultTest);
        }).catch((err) => {
          console.error(err);
          props.setloading(false);
        });

      }}
    >
      Save Changes
    </button>
  );
};

export default EditorSaveButton;
