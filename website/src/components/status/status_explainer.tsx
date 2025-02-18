import { Component } from "solid-js";
import Dialog from "@corvu/dialog";
import StatusChip from "../navbar/status";
import { SiteStatus } from "../../types";

const StatusExplainer: Component<{}> = (props) => {
  return (
    <div class="w-full mb-12 flex flex-col items-center">
      <p class="text-xl mb-2">Table key:</p>
      <div class="flex flex-col w-fit border max-md:w-9/10">
        <StatusChip link="" status={SiteStatus.NOMINAL} />
        <StatusChip link="" status={SiteStatus.PARTIALLY_DEGRADED} />
        <StatusChip link="" status={SiteStatus.FULLY_DEGRADED} />
        <StatusChip link="" status={SiteStatus.OFFLINE} />
        <StatusChip link="" status={SiteStatus.LOADING} />
        <StatusChip link="" status={SiteStatus.UNKNOWN} />
      </div>
    </div>
  );
};

export default StatusExplainer;
