import { Accessor, Component, Setter } from "solid-js";
import styles from "./editor.module.css";
import { useState } from "../../../state";
import { TestData } from "../../../types";
import { getGeneralTestInfo } from "../../../db/db_interaction";

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
  ]: any = useState();

  return (
    <button
      class={styles.inputSave}
      on:click={async () => {
        props.setloading(true);
        (
          await fetch(
            `https://updatetestmetadata-w547ikcrwa-uc.a.run.app/?id=${
              props.testData().id
            }&name=${props.name()}&article=${props.testArticle()}&gse=${props.gseArticle()}`
          )
        )
          .json()
          .then(async (re) => {
            console.log("completed doc update");
            console.log(re);
            await getGeneralTestInfo(setAllKnownTests, setDefaultTest);
          });
      }}
    >
      Save Changes
    </button>
  );
};

export default EditorSaveButton;
