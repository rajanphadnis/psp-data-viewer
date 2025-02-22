import { Component, Show } from "solid-js";
import { SiteStatus, stringToSiteStatus } from "../../types";
import StatusChip from "../navbar/status";

const StatusItem: Component<{ name: string; status: SiteStatus; statusOverride?: SiteStatus; note?: string; hiddenStatusCapable?: boolean }> = (props) => {
  return (
    <div class="flex flex-row border justify-between hover:bg-neutral-800 bg-neutral-900 first:font-bold pl-3">
      <div class="flex flex-row justify-start items-center py-3">{props.name}</div>
      <div class="flex flex-row justify-end items-center">
        <Show when={props.statusOverride} fallback={<StatusChip link="" status={props.status} hiddenCapable={props.hiddenStatusCapable} />}>
          <StatusChip link="" status={props.statusOverride!} hiddenCapable={props.hiddenStatusCapable} />
        </Show>
      </div>
    </div>
  );
};

export default StatusItem;
