export type SelectedFile = {
  path: string;
  is_TDMS: boolean;
  groups: FileGroup[];
  TDMS_VERSION: string;
  BITMASK: string;
  name: string;
  starting_timestamp_millis: number;
};

export type FileGroup = {
  groupName: string;
  channels: {
    channel_name: string;
    data: number[] | undefined;
    time: number[] | undefined;
    offset: number | undefined;
    slope: number | undefined;
    unit: string | undefined;
    zeroing_target: number | undefined;
    zeroing_correction: number | undefined;
    minimum: number | undefined;
    maximum: number | undefined;
    description: string | undefined;
    channel_type: string | undefined;
    tc_type: string | undefined;
    constant_cjc: number | undefined;
    state: LoadingStatus;
  }[];
};

export enum LoadingStatus {
  FINISHED,
  ERROR,
  LOADING,
  UNLOADED,
}

export enum CompilingStatus {
  READY,
  COMPILING,
  RESIZING,
  SAVING,
  COMPLETE,
}

export type ExportChannel = {
  channel_name: string;
  data: number[];
};
