import { Component, createSignal, Match, Show, Switch } from "solid-js";
import {
  copyTextToClipboard,
  delay,
  fallbackCopyTextToClipboard,
} from "../../../browser/util";
import CheckIcon from "../../icons/check";
import IconCopy from "../../icons/copy";

export const Tabs: Component<{}> = (props) => {
  const [selectedTab, setSelectedTab] = createSignal(0);
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
      </div>
      <div>
        <Switch>
          <Match when={selectedTab() == 0}>
            <TabContent code="pythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpythonpython" />
          </Match>
          <Match when={selectedTab() == 1}>
            <TabContent code="JS/TS" />
          </Match>
          <Match when={selectedTab() == 2}>
            <TabContent code="Rust" />
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

const TabContent: Component<{ code: string }> = (props) => {
  const [copied, setCopied] = createSignal(false);
  return (
    <div class="bg-cool-grey flex w-full max-w-full flex-row items-center rounded-b-md border-none p-5 text-start text-white">
      <pre class="scrollbar-white w-full overflow-auto">{props.code}</pre>
      <button
        onclick={async (e) => {
          if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(props.code);
            return;
          }
          navigator.clipboard.writeText(props.code).then(
            async function () {
              console.log("Async: Copying to clipboard was successful!");
              setCopied(true);
              await delay(1000);
              setCopied(false);
            },
            function (err) {
              alert("Failed to copy to clipboard");
              console.error("Async: Could not copy text: ", err);
            },
          );
        }}
        class="ml-2 flex cursor-pointer flex-row items-center justify-center rounded-lg border fill-white p-3 hover:bg-neutral-600"
      >
        <Show when={!copied()} fallback={<CheckIcon class="w-4" />}>
          <IconCopy class="w-4" />
        </Show>
      </button>
    </div>
  );
};
