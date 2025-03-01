import { invoke } from "@tauri-apps/api/core";
import { Setter } from "solid-js";
import { SelectedFile } from "../types";

export async function stackAndFlatten(
  files: { files: SelectedFile[] },
  setErrorMsg: Setter<string>
): Promise<{ [channel_name: string]: number[] }> {
  let toReturn: { [channel_name: string]: number[] } = {};

  for (let f = 0; f < files.files.length; f++) {
    const file = files.files[f];
    for (let g = 0; g < file.groups.length; g++) {
      const group = file.groups[g];
      for (let c = 0; c < group.channels.length; c++) {
        const channel = group.channels[c];
        const existingKeys = Object.keys(toReturn);
        if (existingKeys.includes(channel.channel_name)) {
          // channel already exists in toReturn. Generate datasets to pass to rust fxn
          let dataset1: { [channel_name: string]: number[] } = {};
          let dataset2: { [channel_name: string]: number[] } = {};
          dataset1[`${channel.channel_name}`] = channel.data!;
          dataset1[`${channel.channel_name}_time`] = channel.time!;
          dataset2[`${channel.channel_name}`] = toReturn[`${channel.channel_name}`];
          dataset2[`${channel.channel_name}_time`] = toReturn[`${channel.channel_name}_time`];
          let stack: { [channel_name: string]: number[] };
          try {
            stack = await invoke("stack_data", {
              dataset1: dataset1,
              dataset2: dataset2,
              channel_name: channel.channel_name,
            });
            console.log(stack);
            if (stack) {
              // await finished and returned data. Set toReturn to data calculated from rust fxn
              toReturn[`${channel.channel_name}`] = stack[channel.channel_name];
              toReturn[`${channel.channel_name}_time`] = stack["time"];
            } else {
              setErrorMsg("try/catch logic error: await didn't fully await");
            }
          } catch (error: any) {
            setErrorMsg(error);
          }
        } else {
          console.log(channel);
          (toReturn as any)[`${channel.channel_name}`] = channel.data;
          (toReturn as any)[`${channel.channel_name}_time`] = channel.time;
        }
      }
    }
  }
  console.log(toReturn);

  return toReturn;
}
