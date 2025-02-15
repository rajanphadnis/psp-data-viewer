import { A } from "@solidjs/router";
import { Accessor, Component, createMemo } from "solid-js";
import { SiteStatus } from "../../types";

const StatusChip: Component<{ link: string; status: Accessor<SiteStatus> }> = (props) => {
  let color = createMemo<[color1: string, color2: string]>(() => {
    switch (props.status()) {
      case SiteStatus.NOMINAL:
        return ["bg-green-400", "bg-green-500"];

      case SiteStatus.LOADING:
        return ["bg-sky-400", "bg-sky-500"];

      case SiteStatus.OFFLINE:
        return ["bg-red-500", "bg-red-600"];

      case SiteStatus.PARTIALLY_DEGRADED:
        return ["bg-yellow-300", "bg-yellow-400"];

      case SiteStatus.FULLY_DEGRADED:
        return ["bg-orange-400", "bg-orange-500"];

      default:
        return ["bg-neutral-500", "bg-neutral-600"];
    }
  });

  return (
    <A href={props.link} class={`p-3 flex flex-row items-center cursor-pointer hover:bg-neutral-600`}>
      <p>Status</p>
      <span class="relative flex size-3 ml-2">
        <span class={`absolute inline-flex h-full w-full animate-ping rounded-full ${color()[0]} opacity-75`}></span>
        <span class={`relative inline-flex size-3 rounded-full ${color()[1]}`}></span>
      </span>
    </A>
  );
};

export default StatusChip;
