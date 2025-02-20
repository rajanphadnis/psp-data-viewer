import { Accessor, Component, createMemo, Show } from "solid-js";
import { SiteStatus, siteStatusToString } from "../../types";
import Tooltip from "@corvu/tooltip";

const StatusChip: Component<{ link: string; status: SiteStatus; generic?: boolean; hiddenCapable?: boolean }> = (
  props
) => {
  let color = createMemo<[color1: string, color2: string]>(() => {
    switch (props.status) {
      case SiteStatus.NOMINAL:
        return ["bg-green-400", "bg-green-500"];

      case SiteStatus.LOADING:
        return ["bg-sky-400", "bg-sky-500"];
      // return ["bg-neutral-500", "bg-neutral-600"];

      case SiteStatus.OFFLINE:
        return ["bg-red-500", "bg-red-600"];

      case SiteStatus.PARTIALLY_DEGRADED:
        return ["bg-yellow-300", "bg-yellow-400"];

      case SiteStatus.FULLY_DEGRADED:
        return ["bg-orange-400", "bg-orange-500"];

      case SiteStatus.UNKNOWN:
        return ["bg-neutral-500", "bg-neutral-600"];

      default:
        return ["bg-neutral-500", "bg-neutral-600"];
    }
  });

  return (
    <Tooltip
      placement={`${props.generic ? "bottom" : "right"}`}
      openDelay={0}
      floatingOptions={{
        offset: 13,
        flip: true,
        shift: true,
      }}
    >
      <Tooltip.Trigger
        as="A"
        href={props.link}
        class={`p-3 flex flex-row items-center cursor-pointer ${
          props.generic ? "hover:bg-neutral-600  max-md:w-full max-md:justify-center" : ""
        }`}
      >
        <Show
          when={props.generic}
          fallback={<p class={`${props.hiddenCapable ? "max-xs:hidden" : ""}`}>{siteStatusToString(props.status)}</p>}
        >
          <p class="whitespace-nowrap">Status</p>
        </Show>
        <span class="relative flex size-3 ml-2">
          <span class={`absolute inline-flex h-full w-full animate-ping rounded-full ${color()[0]} opacity-75`}></span>
          <span class={`relative inline-flex size-3 rounded-full ${color()[1]}`}></span>
        </span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="rounded-lg bg-neutral-500 px-3 py-2 font-medium data-open:animate-in data-open:fade-in-50% data-open:slide-in-from-bottom-1 data-closed:animate-out data-closed:fade-out-50% data-closed:slide-out-to-bottom-1">
          {siteStatusToString(props.status)}
          <Tooltip.Arrow class="text-neutral-500" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );
};

export default StatusChip;
