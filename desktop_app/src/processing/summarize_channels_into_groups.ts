import { readFloat, readString } from "../misc";
import { FileGroup, LoadingStatus } from "../types";

export function summarizeChannelsIntoGroups(channel_dat: {
  [channel_name: string]: {
    [prop: string]: string | undefined;
  }[];
}) {
  let groups: FileGroup[] = [];
  const channels = Object.keys(channel_dat);
  for (let c = 0; c < channels.length; c++) {
    const chan = channels[c];

    const channel_data = channel_dat[chan].reduce((result, obj) => {
      return { ...result, ...obj };
    }, {});
    console.log(channel_data);
    const splitString = chan.split("/");
    const group = splitString[1].slice(1, -1);
    const channelName = splitString[2].slice(1, -1);
    const existingGroupObject = groups.filter((listedGroup) => listedGroup.groupName == group);

    let newFileGroupObject: FileGroup;
    if (existingGroupObject.length > 0) {
      const indexLocation = groups.indexOf(existingGroupObject[0]);
      groups.splice(indexLocation, 1);
      const existingChannels = existingGroupObject[0].channels;
      newFileGroupObject = {
        groupName: existingGroupObject[0].groupName,
        channels: [
          ...existingChannels,
          {
            channel_name: channelName,
            data: undefined,
            time: undefined,
            offset: readFloat(channel_data["Offset"]),
            slope: readFloat(channel_data["Slope"]),
            unit: readString(channel_data["Unit"]),
            state: LoadingStatus.UNLOADED,
            zeroing_target: readFloat(channel_data["Zeroing Target"]),
            zeroing_correction: readFloat(channel_data["Zeroing Correction"]),
            minimum: readFloat(channel_data["Minimum"]),
            maximum: readFloat(channel_data["Maximum"]),
            description: readString(channel_data["Description"]),
            channel_type: readString(channel_data["Channel Type"]),
            tc_type: readString(channel_data["TC Type"]),
            constant_cjc: readFloat(channel_data["constant CJC"]),
          },
        ],
      };
    } else {
      newFileGroupObject = {
        groupName: group,
        channels: [
          {
            channel_name: channelName,
            data: undefined,
            time: undefined,
            offset: readFloat(channel_data["Offset"]),
            slope: readFloat(channel_data["Slope"]),
            unit: readString(channel_data["Unit"]),
            state: LoadingStatus.UNLOADED,
            zeroing_target: readFloat(channel_data["Zeroing Target"]),
            zeroing_correction: readFloat(channel_data["Zeroing Correction"]),
            minimum: readFloat(channel_data["Minimum"]),
            maximum: readFloat(channel_data["Maximum"]),
            description: readString(channel_data["Description"]),
            channel_type: readString(channel_data["Channel Type"]),
            tc_type: readString(channel_data["TC Type"]),
            constant_cjc: readFloat(channel_data["constant CJC"]),
          },
        ],
      };
    }
    groups.push(newFileGroupObject);
  }
  return groups;
}
