export type SelectedFile = {
  path: string;
  groups: FileGroup[];
};

export type FileGroup = {
  groupName: string;
  channels: {
    channel_name: string;
    data: number[] | undefined;
    offset: number | undefined;
    slope: number | undefined;
  }[];
};

// export type Channel = {
//   channel_name: string;
//   data: number[] | undefined;
//   offset: number | undefined;
//   slope: number | undefined;
// };
