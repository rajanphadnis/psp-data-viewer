import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ChannelButton from "./components/channel_button";
import CompileButton from "./components/compile_button";
import DeleteIcon from "./components/icons/delete";
import { fileNameFromPath } from "./misc";
import { fetchChannels } from "./processing/fetch";
import { CompilingStatus, SelectedFile } from "./types";

function App() {
  const [errorMsg, setErrorMsg] = createSignal(""); // TODO: convert this to a log instead of a single string
  const [files, setFiles] = createStore({ files: [] as SelectedFile[] });
  const [csvDelay, setCsvDelay] = createSignal(0);
  const [keepRawData, setKeepRawData] = createSignal(true);
  const [compileStatus, setCompileStatus] = createSignal(CompilingStatus.READY);
  // const [eventLog, setEventLog] = createSignal<string[]>([]);
  const [eventLog, setEventLog] = createStore<string[]>([]);

  listen<string>('event-log', (event) => {
    console.log(event);
    setEventLog((currentLog) => [...currentLog, event.payload]);
  });

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
            for (let f = 0; f < files.length; f++) {
              const file = files[f];
              await fetchChannels(setFiles, setErrorMsg, file);
            }
          }}>Add Files</button>
        </div>
        <div class="w-full h-full max-h-full overflow-auto p-3">
          <For each={files.files}>
            {(file, _i) => {
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
                  {(group, _i) => {
                    return <div class="ml-3 flex flex-col">
                      <h1>{group.group_name}</h1>
                      <For each={group.channels}>
                        {(channel, _i) => {
                          return <ChannelButton files={files} setFiles={setFiles} setErrorMsg={setErrorMsg} path={file.path} groupName={group.group_name} channel_name={channel.channel_name} />
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
      <div class={`w-2/3 text-white h-full flex flex-col p-5 pb-0 ${compileStatus() == CompilingStatus.READY ? "justify-center" : "justify-end"} items-center`}>
        <p>{errorMsg()}</p>
        <div class="w-full h-max-3/4 flex flex-col-reverse">
          <div class="w-full h-full overflow-auto">
            <For each={eventLog}>
              {(log, _i) => <p class="text-white">{log}</p>}
            </For>
          </div>
        </div>
        <Show when={files.files.length > 0}>
          <CompileButton setFiles={setFiles} files={files} setErrorMsg={setErrorMsg} keepRawData={keepRawData} compileStatus={compileStatus} setCompileStatus={setCompileStatus} />
          <Show when={compileStatus() == CompilingStatus.READY}>
            <div class="flex flex-row">
              <input id='keepRawData' type='checkbox' checked={keepRawData()} onchange={(e) => {
                setKeepRawData(e.target.checked);
              }} />
              <label for='keepRawData'>
                <span></span>
                Keep Raw Data
                <ins><i>Keep Raw Data</i></ins>
              </label>
            </div>
          </Show>
        </Show>
      </div>

    </div>
  );
}

export default App;
