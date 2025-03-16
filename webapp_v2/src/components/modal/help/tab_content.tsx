import { codeToHtml } from "shiki";
import { Component, createSignal, onMount, Show } from "solid-js";
import { delay, fallbackCopyTextToClipboard } from "../../../browser/util";
import CheckIcon from "../../icons/check";
import IconCopy from "../../icons/copy";

export const TabContent: Component<{
  code: string;
  lang:
    | "typescript"
    | "python"
    | "rust"
    | "bash"
    | "powershell"
    | "matlab"
    | "http";
}> = (props) => {
  const [copied, setCopied] = createSignal(false);
  const [isLoadingHighlights, setIsLoadingHighlights] = createSignal(true);
  let containerRef!: HTMLDivElement;
  onMount(() => {
    codeToHtml(props.code, {
      lang: props.lang,
      theme: "slack-dark",
    }).then((code) => {
      setIsLoadingHighlights(false);
      containerRef.innerHTML = code;
    });
  });
  return (
    <div class="flex w-full max-w-full flex-row items-center rounded-b-md border-none bg-[#272822] text-start text-white relative">
      <Show
        when={!isLoadingHighlights()}
        fallback={
          <pre
            class={`scrollbar-white !m-0 w-full overflow-auto rounded-b-lg p-3 font-mono text-sm`}
          >
            <code>{props.code}</code>
          </pre>
        }
      >
        <div
          ref={containerRef}
          class={`*:scrollbar-white w-full *:overflow-auto [&>*]:rounded-b-lg [&>*]:p-3 [&>*]:font-mono [&>*]:text-sm`}
        ></div>
      </Show>
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
        class="bg-bg absolute top-0 right-0 ml-2 flex cursor-pointer flex-row items-center justify-center rounded-lg border fill-white p-3 hover:bg-neutral-600"
      >
        <Show when={!copied()} fallback={<CheckIcon class="w-4" />}>
          <IconCopy class="w-4" />
        </Show>
      </button>
    </div>
  );
};
