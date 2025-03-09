import { Component, createSignal } from "solid-js";
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

  return (
    <div class="flex flex-row justify-evenly items-center h-full">
      <div class="w-2/5 max-w-2/5 text-center mt-auto mb-auto flex flex-col items-center">
        <h4>Set Instance Count:</h4>
        <input
          type="number"
          class="bg-bg border-3 border-rush text-white w-72 focus:border-aged p-2.5 outline-6 outline-transparent disabled:border-transparent"
          on:input={(e) => {
            setinstanceCount(parseInt(e.target.value));
          }}
          value={instanceCount()}
        />
        <InstanceUpdateButton instanceCount={instanceCount} />
      </div>
      <div class="w-2/5 max-w-2/5 text-center mt-auto mb-auto">
        <InstancesFetchButton setCurrentConfig={setCurrentConfig} />
        <pre class="text-start w-1/2 ml-auto mr-auto">{currentConfig()}</pre>
      </div>
    </div>
  );
};

export default Instances;
