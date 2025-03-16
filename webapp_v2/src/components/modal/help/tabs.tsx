import { Component, createMemo, createSignal, Match, Switch } from "solid-js";
import { config } from "../../../generated_app_info";
import { StateType, useState } from "../../../state";
import { TabContent } from "./tab_content";

export const Tabs: Component<{}> = (props) => {
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
    currentAnnotation,
    setCurrentAnnotation,
    { addDataset, updateDataset, removeDataset, updateColor },
  ] = useState() as StateType;
  const [selectedTab, setSelectedTab] = createSignal(0);

  const apiRequestURL = createMemo(() => {
    return `${config.urls.api_base_url}/api/get_data?id=${testBasics().id}&start=${plotRange().start}&end=${plotRange().end}&channels=${activeDatasets()}&max=${sitePreferences().displayedSamples}`;
  });

  return (
    <div class="my-5 flex flex-col rounded-lg border-2 border-amber-400 p-0">
      <div class="flex flex-row items-center justify-start">
        <TabTitle
          name="Python"
          onclick={() => {
            setSelectedTab(0);
          }}
          roundTopLeft={true}
          isSelected={selectedTab() == 0}
        />
        <TabTitle
          name="JS/TS"
          onclick={() => {
            setSelectedTab(1);
          }}
          roundTopLeft={false}
          isSelected={selectedTab() == 1}
        />
        <TabTitle
          name="Rust"
          onclick={() => {
            setSelectedTab(2);
          }}
          roundTopLeft={false}
          isSelected={selectedTab() == 2}
        />
        <TabTitle
          name="cURL"
          onclick={() => {
            setSelectedTab(3);
          }}
          roundTopLeft={false}
          isSelected={selectedTab() == 3}
        />
        <TabTitle
          name="Powershell"
          onclick={() => {
            setSelectedTab(4);
          }}
          roundTopLeft={false}
          isSelected={selectedTab() == 4}
        />
        <TabTitle
          name="Plain URL"
          onclick={() => {
            setSelectedTab(5);
          }}
          roundTopLeft={false}
          isSelected={selectedTab() == 5}
        />
        <TabTitle
          name="Matlab"
          onclick={() => {
            setSelectedTab(6);
          }}
          roundTopLeft={false}
          isSelected={selectedTab() == 6}
        />
      </div>
      <div>
        <Switch>
          <Match when={selectedTab() == 0}>
            <TabContent
              lang="python"
              code={`# Make sure you have the \`requests\` package installed
# run \`pip install requests\` to install the requests package
import requests

res = requests.get(
    "${apiRequestURL()}"
)
data = res.json()["${activeDatasets()[0]}"]
print(f"${activeDatasets()[0]}: {data}")
`}
            />
          </Match>
          <Match when={selectedTab() == 1}>
            <TabContent
              lang="typescript"
              code={`export {};

const requestURL =
  "${apiRequestURL()}";
(await fetch(requestURL))
  .json()
  .then((response) => {
    console.log(\`${activeDatasets()[0]}: \${response["${activeDatasets()[0]}"]}\`);
  })
  .catch((err) => {
    console.log("Failed to parse JSON from API result");
  });`}
            />
          </Match>
          <Match when={selectedTab() == 2}>
            <TabContent code="Rust" lang="rust" />
          </Match>
          <Match when={selectedTab() == 3}>
            <TabContent
              code={`curl "${apiRequestURL()}" -K config.txt -o data.json`}
              lang="bash"
            />
          </Match>
          <Match when={selectedTab() == 4}>
            <TabContent
              lang="powershell"
              code={`Invoke-WebRequest \`
"https://psp-api.rajanphadnis.com/api/get_data?id=WuBeaYk&start=1730592000002&end=1730606492929&channels=fms__lbf__&max=3000" \`
-OutFile data.json`}
            />
          </Match>
          <Match when={selectedTab() == 5}>
            <TabContent lang="http" code={`${apiRequestURL()}`} />
          </Match>
          <Match when={selectedTab() == 6}>
            <TabContent lang="matlab" code="https://youtu.be/9Deg7VrpHbM" />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

const TabTitle: Component<{
  name: string;
  onclick: () => void;
  roundTopLeft: boolean;
  isSelected: boolean;
}> = (props) => {
  return (
    <button
      class={`hover:bg-cool-grey cursor-pointer border-r border-r-white px-3 py-2 text-center text-white ${props.roundTopLeft ? "rounded-tl-md" : ""} ${props.isSelected ? "bg-cool-grey" : "bg-bg"}`}
      onclick={(e) => {
        props.onclick();
      }}
    >
      {props.name}
    </button>
  );
};
