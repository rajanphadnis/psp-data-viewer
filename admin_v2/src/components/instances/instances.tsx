import { Component, createSignal } from "solid-js";
import styles from "./instances.module.css";
import { useState } from "../../state";
import InstanceUpdateButton from "./update_button";
import InstancesFetchButton from "./fetch_button";

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
  ]: any = useState();

  const [instanceCount, setinstanceCount] = createSignal<number>(0);

  const [currentConfig, setCurrentConfig] = createSignal<string>("");

  return (
    <div class={styles.instancesDiv}>
      <div class={styles.centered}>
        <h4>Set Instance Count:</h4>
        <input
          type="number"
          class={styles.textField}
          on:input={(e) => {
            setinstanceCount(parseInt(e.target.value));
          }}
          value={instanceCount()}
        />
        <InstanceUpdateButton instanceCount={instanceCount} />
      </div>
      <div class={styles.centered}>
        <InstancesFetchButton setCurrentConfig={setCurrentConfig} />
        <pre class={styles.currentConfig}>{currentConfig()}</pre>
      </div>
    </div>
  );
};

export default Instances;
