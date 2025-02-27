import { invoke } from "@tauri-apps/api/core";
import { summarizeChannelsIntoGroups } from "../file_list_manipulation";
import { FileGroup, SelectedFile } from "../types";
import { reconcile, SetStoreFunction } from "solid-js/store";
import { Setter } from "solid-js";

export async function fetchChannels(
  setFiles: SetStoreFunction<{
    files: SelectedFile[];
  }>,
  setErrorMsg: Setter<string>,
  filePath: string
) {
  const isTDMS = filePath.slice(-5) == ".tdms";
  if (isTDMS) {
    const fetchChannels: Promise<string[]> = invoke("get_all_channels", { path_string: filePath });
    fetchChannels
      .then((channels) => {
        let groups: FileGroup[] = summarizeChannelsIntoGroups(channels);
        console.log(filePath.slice(-5) == ".tdms");
        setFiles("files", (currentFiles) => [
          ...currentFiles,
          {
            path: filePath,
            groups: groups,
            is_TDMS: isTDMS,
          } as SelectedFile,
        ]);
      })
      .catch((errors) => {
        setErrorMsg(errors[0]);
      });
  }
}

export async function fetchTDMSData(
  setFiles: SetStoreFunction<{
    files: SelectedFile[];
  }>,
  setErrorMsg: Setter<string>,
  filePath: string,
  groupName: string,
  channelName: string
) {
  console.log("starting runner");
  const fetchData: Promise<number[] | string> = invoke("process_channel_data", {
    group_name: groupName,
    channel_name: channelName,
    file_path: filePath,
  });
  await fetchData
    .then((dat) => {
      const data = dat as number[];
      console.log(data);
      setFiles(
        "files",
        (file) => file.path == filePath,
        "groups",
        (group) => group.groupName == groupName,
        "channels",
        (channel) => channel.channel_name == channelName,
        "data",
        data
      );
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg(error);
    });
}
