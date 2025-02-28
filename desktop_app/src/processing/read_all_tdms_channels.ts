import { SetStoreFunction } from "solid-js/store";
import { LoadingStatus, SelectedFile } from "../types";
import { fetchTDMSData } from "./fetch";
import { Setter } from "solid-js";

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
  files.files.forEach((file) => {
    file.groups.forEach((group) => {
      group.channels.forEach((channel) => {
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
          const datalength = await fetchTDMSData(
            setFiles,
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
          resolve();
        });
        processingPromises.push(channelPromise);
      });
    });
  });
  return processingPromises;
}
