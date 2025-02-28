import { invoke } from "@tauri-apps/api/core";
import { summarizeChannelsIntoGroups } from "../file_list_manipulation";
import { FileGroup, SelectedFile } from "../types";
import { SetStoreFunction } from "solid-js/store";
import { Setter } from "solid-js";
import { readRawData } from "./read_raw_tdms";
import { parseDate, parseHz } from "../misc";

export async function fetchChannels(
  setFiles: SetStoreFunction<{
    files: SelectedFile[];
  }>,
  setErrorMsg: Setter<string>,
  filePath: string
) {
  const isTDMS = filePath.slice(-5) == ".tdms";
  if (isTDMS) {
    const fetchChannels: Promise<{
      [channel_name: string]: {
        [prop: string]: string;
      };
    }> = invoke("get_all_channels", { path_string: filePath });
    fetchChannels
      .then(async (channelData) => {
        let groups: FileGroup[] = summarizeChannelsIntoGroups(channelData);
        let meta = await readRawData(filePath);
        const date_millis = parseDate(meta.name!, filePath);
        setFiles("files", (currentFiles) => [
          ...currentFiles,
          {
            path: filePath,
            groups: groups,
            is_TDMS: isTDMS,
            TDMS_VERSION: meta.tdms_version,
            name: meta.name,
            BITMASK: meta.bit_mask,
            starting_timestamp_millis: date_millis,
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
  files: {
    files: SelectedFile[];
  },
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
  return await fetchData
    .then((dat) => {
      const data = dat as number[];

      const file = files.files.filter((fil_inner) => fil_inner.path == filePath)[0];
      const data_freq = parseHz(groupName);
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
      return data.length;
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg(error);
      return 0;
    });
}
