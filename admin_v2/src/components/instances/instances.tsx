import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Component, createEffect, createSignal, Show } from "solid-js";
import { useState } from "../../state";
import InstancesFetchButton from "./fetch_button";
import InstanceUpdateButton from "./update_button";

const Instances: Component<{}> = (props) => {
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

  const [instanceCount, setinstanceCount] = createSignal<number>(0);

  const [currentConfig, setCurrentConfig] = createSignal<string>("");
  const [currentInstances, setCurrentInstances] = createSignal<number>();

  createEffect(async () => {
    if (org() != undefined) {
      const accountsSnapshot = await getDocs(
        query(
          collection(globalThis.adminDB, "accounts"),
          where("slug", "==", org()!),
        ),
      );
      let docID = "";
      accountsSnapshot.forEach(async (doc) => {
        docID = doc.id;
      });
      const historySnapshot = await getDocs(
        query(
          collection(globalThis.adminDB, `accounts/${docID}/instance_history`),
          orderBy("setTime", "desc"),
          limit(1),
        ),
      );
      const currentInstances: number =
        historySnapshot.docs[0].data()["instances"];
      console.log(currentInstances);
      setCurrentInstances(currentInstances);
    }
  });

  return (
    <div class="flex h-full flex-row items-center justify-evenly">
      <div class="mt-auto mb-auto flex w-2/5 max-w-2/5 flex-col items-center text-center">
        <h4>Set Instance Count:</h4>
        <input
          type="number"
          class="bg-bg border-rush focus:border-aged w-72 border-3 p-2.5 text-white outline-6 outline-transparent disabled:border-transparent"
          on:input={(e) => {
            setinstanceCount(parseInt(e.target.value));
          }}
          value={instanceCount()}
        />
        <InstanceUpdateButton instanceCount={instanceCount} />
        <Show when={currentInstances()}>
          <p>Current Instances: {currentInstances()!}</p>
        </Show>
      </div>
      <div class="mt-auto mb-auto w-2/5 max-w-2/5 text-center">
        <InstancesFetchButton setCurrentConfig={setCurrentConfig} />
        <pre class="mr-auto ml-auto w-1/2 text-start">{currentConfig()}</pre>
      </div>
    </div>
  );
};

export default Instances;
