import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store"
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { FileGroup, SelectedFile } from "./types";
import { fileNameFromPath } from "./misc";

function App() {
  const [errorMsg, setErrorMsg] = createSignal("");
  const [files, setFiles] = createStore({ files: [] as SelectedFile[] });

  async function fetchChannels(filePath: string) {
    const fetchChannels: Promise<string[]> = invoke("get_all_channels", { path_string: filePath });
    fetchChannels.then((channels) => {
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
            channels: [...existingChannels, {
              channel_name: channelName,
              data: undefined,
              offset: undefined,
              slope: undefined
            }]
          }
        }
        else {
          newFileGroupObject = {
            groupName: group,
            channels: [{
              channel_name: channelName,
              data: undefined,
              offset: undefined,
              slope: undefined
            }]
          }
        }
        groups.push(newFileGroupObject);
      });
      setFiles("files", (currentFiles) => [
        ...currentFiles,
        {
          path: filePath,
          groups: groups
        } as SelectedFile
      ]);
    })
      .catch((errors) => {
        setErrorMsg(errors[0]);
      })
  }

  return (
    <div class="w-full h-full bg-transparent m-0 p-0 flex flex-row overscroll-none">
      <div class="w-1/3 h-full bg-neutral-600 flex flex-col p-0">
        <div class="w-full p-3">
          <button type="submit" class="bg-amber-400 w-full p-3 rounded-lg shadow cursor-pointer hover:shadow-xl" onclick={async () => {
            const files = await open({
              multiple: true,
              directory: false,
              filters: [{
                name: 'Datafiles',
                extensions: ['tdms', 'csv']
              }]
            });
            if (files == null) {
              return;
            }
            files.forEach(async (file) => {
              await fetchChannels(file);
            });
          }}>Add Files</button>
        </div>
        <div class="w-full h-full max-h-full overflow-auto p-3">
          <For each={files.files}>
            {(file, i) => {
              return <div class="bg-neutral-500 rounded-lg p-3 mb-3">
                <h1 class="font-bold">{fileNameFromPath(file.path)}</h1>
                <For each={file.groups}>
                  {(group, i) => {
                    return <div class="ml-3">
                      <h1>{group.groupName}</h1>
                      <For each={group.channels}>
                        {(channel, i) => {
                          return <p class="ml-3">{channel.channel_name}</p>
                        }}
                      </For>
                    </div>
                  }}
                </For>
              </div>
            }}
          </For>
        </div>
      </div>
      <div class="w-2/3">
        <p>{errorMsg()}</p>
      </div>

    </div>
  );
}

export default App;
