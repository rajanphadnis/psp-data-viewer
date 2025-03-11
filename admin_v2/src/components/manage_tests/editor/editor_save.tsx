import { httpsCallable } from "firebase/functions";
import { Accessor, Component, Setter } from "solid-js";
import { getGeneralTestInfo } from "../../../db/db_interaction";
import { config } from "../../../generated_app_check_secret";
import { useState } from "../../../state";
import { TestData } from "../../../types";

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
      class="m-0 p-5 bg-rush text-black font-bold border-0 cursor-pointer relative bottom-0 w-full mt-2.5 hover:bg-rush-light"
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
