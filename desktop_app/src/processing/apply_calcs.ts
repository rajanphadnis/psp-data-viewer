import { invoke } from "@tauri-apps/api/core";
import { Setter } from "solid-js";
import { SelectedFile } from "../types";

export async function apply_calcs(
  files: { files: SelectedFile[] },
  data_input: { [channel_name: string]: number[] },
  setErrorMsg: Setter<string>,
  keepRawData: boolean
): Promise<{ [channel_name: string]: number[] }> {
  //   console.log(files);
  let toReturn: { [channel_name: string]: number[] } = {};

  const allChannels = files.files.flatMap((file) => file.groups.flatMap((group) => group.channels));

  const filteredChannels = allChannels.filter((chan) => !chan.channel_name.endsWith("_time"));
  let allPromises: Promise<void>[] = [];

  for (let i = 0; i < filteredChannels.length; i++) {
    const channel = filteredChannels[i];
    // console.log(channel);
    if (channel.channel_type?.includes("AI")) {
      const promise: Promise<void> = new Promise(async (res, rej) => {
        const data = data_input[`${channel.channel_name}`];
        const time = data_input[`${channel.channel_name}_time`];
        try {
          const calculated_data: number[] = await invoke("apply_calcs", {
            data: data,
            slope: channel.slope,
            offset: channel.offset,
            zeroing_correction: channel.zeroing_correction,
          });
          toReturn[`${channel.channel_name}__${channel.unit}__`] = calculated_data;
          toReturn[`${channel.channel_name}_time`] = time;
          if (keepRawData) {
            toReturn[`${channel.channel_name}_raw__raw__`] = data;
          }
          res();
        } catch (error: any) {
          setErrorMsg(error);
          rej();
        }
      });
      allPromises.push(promise);
    } else {
      const data = data_input[channel.channel_name];
      const time = data_input[`${channel.channel_name}_time`];
      toReturn[`${channel.channel_name}__${channel.unit}__`] = data;
      toReturn[`${channel.channel_name}_time`] = time;
    }
  }

  console.log(allPromises);
  await Promise.all(allPromises);
  console.log(toReturn);

  return toReturn;
}
