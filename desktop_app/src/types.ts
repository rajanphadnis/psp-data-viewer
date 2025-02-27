export type SelectedFile = {
  path: string;
  is_TDMS: boolean;
  groups: FileGroup[];
};

export type FileGroup = {
  groupName: string;
  channels: {
    channel_name: string;
    data: number[] | undefined;
    offset: number | undefined;
    slope: number | undefined;
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
  SAVING,
  COMPLETE,
}

export type ExportChannel = {
  channel_name: string;
  data: number[];
};
