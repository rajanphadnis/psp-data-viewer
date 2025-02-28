import { readFloat, readString } from "../misc";
import { FileGroup, LoadingStatus } from "../types";

export function summarizeChannelsIntoGroups(channel_data: {
  [channel_name: string]: {
    [prop: string]: string | undefined;
  };
}) {
  let groups: FileGroup[] = [];
  const channels = Object.keys(channel_data);
  channels.forEach((chan) => {
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
            offset: readFloat(channel_data[chan]["Offset"]),
            slope: readFloat(channel_data[chan]["Slope"]),
            unit: readString(channel_data[chan]["Unit"]),
            state: LoadingStatus.UNLOADED,
            zeroing_target: readFloat(channel_data[chan]["Zeroing Target"]),
            zeroing_correction: readFloat(channel_data[chan]["Zeroing Correction"]),
            minimum: readFloat(channel_data[chan]["Minimum"]),
            maximum: readFloat(channel_data[chan]["Maximum"]),
            description: readString(channel_data[chan]["Description"]),
            channel_type: readString(channel_data[chan]["Channel Type"]),
            tc_type: readString(channel_data[chan]["TC Type"]),
            constant_cjc: readFloat(channel_data[chan]["constant CJC"]),
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
            offset: readFloat(channel_data[chan]["Offset"]),
            slope: readFloat(channel_data[chan]["Slope"]),
            unit: readString(channel_data[chan]["Unit"]),
            state: LoadingStatus.UNLOADED,
            zeroing_target: readFloat(channel_data[chan]["Zeroing Target"]),
            zeroing_correction: readFloat(channel_data[chan]["Zeroing Correction"]),
            minimum: readFloat(channel_data[chan]["Minimum"]),
            maximum: readFloat(channel_data[chan]["Maximum"]),
            description: readString(channel_data[chan]["Description"]),
            channel_type: readString(channel_data[chan]["Channel Type"]),
            tc_type: readString(channel_data[chan]["TC Type"]),
            constant_cjc: readFloat(channel_data[chan]["constant CJC"]),
          },
        ],
      };
    }
    groups.push(newFileGroupObject);
  });
  return groups;
}
