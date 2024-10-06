export const enum loadingStatus {
  LOADING,
  DONE,
  ERROR,
}

export const enum stepStatus {
  WRITTEN,
  EDITING,
  COMPLETED,
  WIP
}

export interface ProcedureStep {
  major_id: number,
  minor_id: string,
  instructions: string,
  status: stepStatus,
  status_details: string,
  operators: string[],
}

export interface SectionHeaders {
  major_id: string,
  title: string,
}
