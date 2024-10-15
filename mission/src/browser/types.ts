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
  is_substep: boolean;
  ref_id: string;
}

export interface SectionHeaders {
  major_id: string;
  title: string;
}

export interface SeatingChart {
  room_name: string;
  chart: string;
  ref_id: string;
}

export interface RoleAssignments {
  operator: string;
  name: string;
}

export interface Roster {
  operator: string;
  names: string[];
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

export function enum_to_icon(to_convert: string) {
  let to_return = "";
  switch (to_convert) {
    case enum_to_string(stepStatus.WRITTEN):
      to_return = "W";
      break;
    case enum_to_string(stepStatus.EDITING):
      to_return = "E";

      break;
    case enum_to_string(stepStatus.COMPLETED):
      to_return = "C";

      break;
    case enum_to_string(stepStatus.WIP):
      to_return = "F";

      break;

    default:
      break;
  }
  return to_return;
}

export function roster_to_object(roster: Roster[]): { [index: string]: string[] } {
  let to_return: { [index: string]: string[] } = {};
  roster.forEach((roster_entry) => {
    to_return[roster_entry.operator] = roster_entry.names;
  });
  return to_return;
}
