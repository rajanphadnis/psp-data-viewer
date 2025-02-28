import { createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store"
import { open } from '@tauri-apps/plugin-dialog';
import { SelectedFile } from "./types";
import { fetchChannels } from "./processing/fetch";
import { fileNameFromPath } from "./misc";
import ChannelButton from "./components/channel_button";
import CompileButton from "./components/compile_button";
import DeleteIcon from "./components/icons/delete";

function App() {
  const [errorMsg, setErrorMsg] = createSignal("");
  const [files, setFiles] = createStore({ files: [] as SelectedFile[] });
  const [csvDelay, setCsvDelay] = createSignal(0);

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
              await fetchChannels(setFiles, setErrorMsg, file);
            });
          }}>Add Files</button>
        </div>
        <div class="w-full h-full max-h-full overflow-auto p-3">
          <For each={files.files}>
            {(file, i) => {
              return <div class="bg-neutral-500 rounded-lg p-3 mb-3">
                <div class="flex flex-row justify-between items-center">
                  <h1 class="font-bold">{fileNameFromPath(file.path)}</h1>
                  <button class="cursor-pointer" onclick={() => {
                    setFiles("files", (files_inner: SelectedFile[]) => files_inner.filter((filt) => filt.path != file.path));
                  }}>
                    <DeleteIcon class="w-4 h-4 fill-white" />
                  </button>
                </div>
                <For each={file.groups}>
                  {(group, i) => {
                    return <div class="ml-3 flex flex-col">
                      <h1>{group.groupName}</h1>
                      <For each={group.channels}>
                        {(channel, i) => {
                          return <ChannelButton files={files} setFiles={setFiles} setErrorMsg={setErrorMsg} path={file.path} groupName={group.groupName} channel_name={channel.channel_name} />
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
      <div class="w-2/3 text-white h-full flex flex-col justify-center items-center">
        <p>{errorMsg()}</p>
        <Show when={files.files.length > 0}>
          <CompileButton setFiles={setFiles} files={files} setErrorMsg={setErrorMsg} />
        </Show>
      </div>

    </div>
  );
}

export default App;
