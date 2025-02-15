export enum SiteStatus {
  NOMINAL,
  PARTIALLY_DEGRADED,
  FULLY_DEGRADED,
  OFFLINE,
  UNKNOWN,
  LOADING,
}

export function siteStatusToString(status: SiteStatus): string {
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
