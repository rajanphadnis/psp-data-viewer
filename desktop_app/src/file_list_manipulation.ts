import { FileGroup, LoadingStatus } from "./types";

export function summarizeChannelsIntoGroups(channels: string[]) {
  let groups: FileGroup[] = [];
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
            offset: undefined,
            slope: undefined,
            state: LoadingStatus.UNLOADED,
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
            offset: undefined,
            slope: undefined,
            state: LoadingStatus.UNLOADED,
          },
        ],
      };
    }
    groups.push(newFileGroupObject);
  });
  return groups;
}
