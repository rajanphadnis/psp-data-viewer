import { Component, Show } from "solid-js";
import styles from "./plot.module.css";
import PlotOverlay from "./plot_overlay";
import { useState } from "../../state";

const Plot: Component<{}> = (props) => {
  const [activeDatasets, setActiveDatasets, { addDataset, updateDataset, removeDataset }]: any = useState();
  return (
    <div class={styles.plot} id="plot">
      <Show when={activeDatasets().length == 0}>
        <PlotOverlay />
      </Show>
    </div>
  );
};

export default Plot;
