export const enum loadingStatus {
  LOADING,
  DONE,
  ERROR,
}

export const enum stepStatus {
  WRITTEN,
  EDITING,
  COMPLETED,
  WIP,
}

export interface ProcedureStep {
  major_id: number;
  minor_id: string;
  instructions: string;
  status: stepStatus;
  status_details: string;
  operators: string[];
  ref_id: string;
}

export interface SectionHeaders {
  major_id: string;
  title: string;
}

export function enum_to_string(to_convert: stepStatus) {
  let to_return = "";
  switch (to_convert) {
    case stepStatus.WRITTEN:
      to_return = "WRITTEN";
      break;
    case stepStatus.EDITING:
      to_return = "EDITING";

      break;
    case stepStatus.COMPLETED:
      to_return = "COMPLETED";

      break;
    case stepStatus.WIP:
      to_return = "WIP";

      break;

    default:
      break;
  }
  return to_return;
}
