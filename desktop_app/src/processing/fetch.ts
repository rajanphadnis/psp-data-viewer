import { invoke } from "@tauri-apps/api/core";
import { summarizeChannelsIntoGroups } from "./summarize_channels_into_groups";
import { CompilingStatus, CsvFile, FileGroup, LoadingStatus, SelectedFile } from "../types";
import { SetStoreFunction } from "solid-js/store";
import { Setter } from "solid-js";
import { readRawData } from "./read_raw_tdms";
import { parseDate, parseHz } from "../misc";

export async function fetchChannels(
  setFiles: SetStoreFunction<{
    files: SelectedFile[];
  }>,
  setErrorMsg: Setter<string>,
  filePath: string,
  setEventLog: SetStoreFunction<string[]>,
  setCompileStatus: Setter<CompilingStatus>,
  setCsv: SetStoreFunction<CsvFile[]>
) {
  const isTDMS = filePath.slice(-5) == ".tdms";
  if (isTDMS) {
    const fetchChannels: Promise<{
      [channel_name: string]: {
        [prop: string]: string;
      }[];
    }> = invoke("get_all_channels", { path_string: filePath });
    fetchChannels
      .then(async (channelData) => {
        setEventLog((log) => [...log, `Opened File: ${filePath}`]);
        let groups: FileGroup[] = summarizeChannelsIntoGroups(channelData);
        let meta = await readRawData(filePath);
        const date_millis = parseDate(meta.name!);
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
        setEventLog((log) => [...log, `Read file table bits as:`]);
        setEventLog((log) => [...log, `    is_TDMS: ${isTDMS}`]);
        setEventLog((log) => [...log, `    TDMS version: ${meta.tdms_version}`]);
        setEventLog((log) => [...log, `    initial file save name: ${meta.name}`]);
        setEventLog((log) => [...log, `    TDMS feature bitmask: ${meta.bit_mask}`]);
        setEventLog((log) => [...log, `Parsed filename to initial UNIX timestamp: ${date_millis}`]);
      })
      .catch((errors) => {
        console.log(errors);
        setEventLog((log) => [...log, `Failed to open TDMS file. TDMS segments may be corrupted or cut short.`]);
        setErrorMsg(errors);
        setCompileStatus(CompilingStatus.FAILED);
      });
  } else {
    const fetchChannels: Promise<string[]> = invoke("get_csv_info", { file_path: filePath });
    fetchChannels
      .then((headers) => {
        console.log(headers);
        setCsv((currentCSV) => {
          let toReturn: {
            channel_name: string;
          }[] = [];
          for (let i = 0; i < headers.length; i++) {
            const chan = headers[i];
            const toPush = {
              channel_name: chan,
            };
            toReturn.push(toPush);
          }
          return [
            ...currentCSV,
            {
              csv_delay: 0,
              file_path: filePath,
              datasets: toReturn,
              state: LoadingStatus.UNLOADED
            } as CsvFile,
          ];
        });
      })
      .catch((error) => {
        console.log(error);
        setEventLog((log) => [...log, `Failed to open/read CSV file.`]);
        setErrorMsg(error);
        setCompileStatus(CompilingStatus.FAILED);
        setCsv((file) => file.file_path == filePath, "state", LoadingStatus.ERROR);
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
    .then(async (dat) => {
      const data = dat as number[];

      const file = files.files.filter((fil_inner) => fil_inner.path == filePath)[0];
      const data_freq = parseHz(groupName);
      const step = Math.ceil((1 / data_freq) * 1000);
      const fetchTimeframe: number[] = await invoke("create_timeframe", {
        starting_timestamp: file.starting_timestamp_millis,
        freq: step,
        length: data.length,
      });
      // console.log(fetchTimeframe);
      setFiles(
        "files",
        (file) => file.path == filePath,
        "groups",
        (group) => group.group_name == groupName,
        "channels",
        (channel) => channel.channel_name == channelName,
        "data",
        data
      );
      setFiles(
        "files",
        (file) => file.path == filePath,
        "groups",
        (group) => group.group_name == groupName,
        "channels",
        (channel) => channel.channel_name == channelName,
        "time",
        fetchTimeframe
      );
      return data.length;
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg(error);
      return 0;
    });
}

export async function fetchCSVData(
  path: string,
  channel_name: string,
  setCsv: SetStoreFunction<CsvFile[]>,
  setErrorMsg: Setter<string>
) {
  const fetchData: Promise<[number[], number[]]> = invoke("read_channel", {
    file_path: path,
    channel_name: channel_name,
  });
  return await fetchData
    .then((csv_data) => {
      setCsv(
        (file) => file.file_path == path,
        "datasets",
        (channel) => channel.channel_name == channel_name,
        "data",
        csv_data[0]
      );
      setCsv(
        (file) => file.file_path == path,
        "datasets",
        (channel) => channel.channel_name == channel_name,
        "time",
        csv_data[1]
      );
      console.log(csv_data);
      return csv_data[0].length;
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg(error);
      return 0;
    });
}
