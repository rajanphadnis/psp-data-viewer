import { Component, createSignal, Show } from "solid-js";
import { getSharelink } from "../../browser/sharelink";
import { copyTextToClipboard, delay } from "../../browser/util";
import { StateType, useState } from "../../state";
import styles from "./navbar.module.css";

const SharelinkButton: Component<{}> = (props) => {
  const [
    activeDatasets,
    setActiveDatasets,
    appReadyState,
    setAppReadyState,
    loadingState,
    setLoadingState,
    testBasics,
    setTestBasics,
    allKnownTests,
    setAllKnownTests,
    datasetsLegendSide,
    setDatasetsLegendSide,
    plotRange,
    setPlotRange,
    plotPalletteColors,
    setPlotPalletteColors,
    sitePreferences,
    setSitePreferences,
    loadingDatasets,
    setLoadingDatasets,
    measuring,
    setMeasuring,
    annotations,
    setAnnotations,
    {
      addDataset,
      updateDataset,
      removeDataset,
      updateColor,
    },
  ] = useState() as StateType;
  const [showDone, setDone] = createSignal<boolean>(false);

  return (
    <button
      title="Copy link that points to the current plot config"
      class={styles.sharelinkButton}
      // disabled={activeDatasets().length == 0}
      style={{ opacity: activeDatasets().length == 0 ? 0 : 1 }}
      onClick={async () => {
        const [sharelink, b64]: [string, string] = getSharelink(
          activeDatasets(),
          plotRange().start,
          plotRange().end,
          datasetsLegendSide()
        );
        copyTextToClipboard(sharelink);
        console.log(sharelink);
        setDone(true);
        await delay(1000);
        setDone(false);
      }}
    >
      <Show when={!showDone()} fallback={"Copied!"}>
        Share
      </Show>
    </button>
  );
};

export default SharelinkButton;
