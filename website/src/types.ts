export enum SiteStatus {
  NOMINAL,
  PARTIALLY_DEGRADED,
  FULLY_DEGRADED,
  OFFLINE,
  UNKNOWN,
  LOADING,
}

export function siteStatusToString(status: SiteStatus, humanReadable: boolean = false): string {
  if (humanReadable) {
    switch (status) {
      case SiteStatus.FULLY_DEGRADED:
        return "FULLY_DEGRADED";
      case SiteStatus.LOADING:
        return "LOADING";
      case SiteStatus.NOMINAL:
        return "NOMINAL";
      case SiteStatus.OFFLINE:
        return "OFFLINE";
      case SiteStatus.PARTIALLY_DEGRADED:
        return "PARTIALLY_DEGRADED";
      case SiteStatus.UNKNOWN:
        return "UNKNOWN";
      default:
        return "UNKNOWN";
    }
  } else {
    switch (status) {
      case SiteStatus.FULLY_DEGRADED:
        return "Highly Degraded";
      case SiteStatus.LOADING:
        return "Loading...";
      case SiteStatus.NOMINAL:
        return "Norminal Service";
      case SiteStatus.OFFLINE:
        return "Offline";
      case SiteStatus.PARTIALLY_DEGRADED:
        return "Partially Degraded";
      case SiteStatus.UNKNOWN:
        return "UNKNOWN";
      default:
        return "UNKNOWN";
    }
  }
}

export function stringToSiteStatus(status: string): SiteStatus {
  switch (status) {
    case "FULLY_DEGRADED":
      return SiteStatus.FULLY_DEGRADED;
    case "LOADING":
      return SiteStatus.LOADING;
    case "NOMINAL":
      return SiteStatus.NOMINAL;
    case "OFFLINE":
      return SiteStatus.OFFLINE;
    case "PARTIALLY_DEGRADED":
      return SiteStatus.PARTIALLY_DEGRADED;
    case "UNKNOWN":
      return SiteStatus.UNKNOWN;
    default:
      return SiteStatus.UNKNOWN;
  }
}

export type statusType = {
  status: SiteStatus;
  note: string | undefined;
  title: string;
};

export enum ProvisioningStatus {
  PENDING,
  DEPLOYING,
  SUCCEEDED,
  FAILED,
}
