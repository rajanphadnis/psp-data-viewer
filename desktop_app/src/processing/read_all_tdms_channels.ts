import { Setter } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { LoadingStatus, SelectedFile } from "../types";
import { fetchTDMSData } from "./fetch";

export function readAllTdmsChannels(
  files: {
    files: SelectedFile[];
  },
  setFiles: SetStoreFunction<{
    files: SelectedFile[];
  }>,
  setErrorMsg: Setter<string>
): Promise<void>[] {
  let processingPromises: Promise<void>[] = [];
  for (let f = 0; f < files.files.length; f++) {
    const file = files.files[f];
    for (let g = 0; g < file.groups.length; g++) {
      const group = file.groups[g];
      for (let c = 0; c < group.channels.length; c++) {
        const channel = group.channels[c];
        const channelPromise: Promise<void> = new Promise(async (resolve, reject) => {
          setFiles(
            "files",
            (file_filter) => file_filter.path == file.path,
            "groups",
            (group_filter) => group_filter.groupName == group.groupName,
            "channels",
            (channel_filter) => channel_filter.channel_name == channel.channel_name,
            "state",
            LoadingStatus.LOADING
          );
          try {
            const datalength = await fetchTDMSData(
              setFiles,
              files,
              setErrorMsg,
              file.path,
              group.groupName,
              channel.channel_name
            );
            console.log(datalength);
            setFiles(
              "files",
              (file_filter) => file_filter.path == file.path,
              "groups",
              (group_filter) => group_filter.groupName == group.groupName,
              "channels",
              (channel_filter) => channel_filter.channel_name == channel.channel_name,
              "state",
              LoadingStatus.FINISHED
            );
          } catch (error) {
            reject();
          }
          resolve();
        });
        processingPromises.push(channelPromise);
      }
    }
  }

  return processingPromises;
}
