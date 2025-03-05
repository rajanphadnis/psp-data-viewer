import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import ChannelButton from "./components/channel_button";
import CompileButton from "./components/compile_button";
import CsvDatasetButton from './components/csv_dataset_button';
import DeleteIcon from "./components/icons/delete";
import { fileNameFromPath, processLogMessage } from "./misc";
import { fetchChannels } from "./processing/fetch";
import { CompilingStatus, CsvFile, SelectedFile } from "./types";
import { appVersion, buildDate } from './build_info';

function App() {
  const [errorMsg, setErrorMsg] = createSignal("");
  const [files, setFiles] = createStore({ files: [] as SelectedFile[] });
  const [csv, setCsv] = createStore<CsvFile[]>([]);
  const [keepRawData, setKeepRawData] = createSignal(true);
  const [compileStatus, setCompileStatus] = createSignal(CompilingStatus.READY);
  const [eventLog, setEventLog] = createStore<string[]>([`Dataviewer.Space Desktop Formatter: ${appVersion}, built on ${buildDate}`]);

  listen<string>('event-log', (event) => {
    console.log(event);
    processLogMessage(files, setFiles, event.payload, setCompileStatus);
    setEventLog((currentLog) => [...currentLog, event.payload]);
    const logBox = document.getElementById("logBox") as HTMLDivElement;
    setTimeout(() => {
      // const isScrolledToBottom = logBox.scrollHeight - logBox.clientHeight <= logBox.scrollTop + 150;
      if (true) {
        console.log("sticky error log: true");
        logBox.scrollTop = logBox.scrollHeight;
      }
    }, 250);
  });

  return (
    <div class="w-full h-full bg-transparent m-0 p-0 flex flex-row overscroll-none">
      <div class="w-1/3 h-full bg-neutral-600 flex flex-col p-0">
        <Show when={compileStatus() == CompilingStatus.READY}>
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
                await fetchChannels(setFiles, setErrorMsg, file, setEventLog, setCompileStatus, setCsv);
              }
            }}>Add Files</button>
          </div>
        </Show>
        <div class="w-full h-full max-h-full overflow-auto p-3">
          <For each={files.files}>
            {(file, _i) => {
              return <div class="bg-neutral-500 rounded-lg p-3 mb-3">
                <div class="flex flex-row justify-between items-center">
                  <h1 class="font-bold">{fileNameFromPath(file.path)}</h1>
                  <Show when={compileStatus() == CompilingStatus.READY}>
                    <button class="cursor-pointer" onclick={() => {
                      setFiles("files", (files_inner: SelectedFile[]) => files_inner.filter((filt) => filt.path != file.path));
                    }}>
                      <DeleteIcon class="w-4 h-4 fill-white" />
                    </button>
                  </Show>
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
          <For each={csv}>
            {(file, _) => {
              return <div class="bg-neutral-500 rounded-lg p-3 mb-3">
                <div class="flex flex-row justify-between items-center">
                  <h1 class="font-bold">{fileNameFromPath(file.file_path)}</h1>
                  <Show when={compileStatus() == CompilingStatus.READY}>
                    <button class="cursor-pointer" onclick={() => {
                      // setFiles("files", (files_inner: SelectedFile[]) => files_inner.filter((filt) => filt.path != file.path));
                    }}>
                      <DeleteIcon class="w-4 h-4 fill-white" />
                    </button>
                  </Show>
                </div>
                <p>CSV Delay: {file.csv_delay}</p>
                <For each={file.datasets}>
                  {(dataset, _) => {
                    return <CsvDatasetButton csv={csv} setCsv={setCsv} setErrorMsg={setErrorMsg} channel_name={dataset.channel_name} file_path={file.file_path} />
                  }}
                </For>
              </div>
            }}
          </For>
        </div>
      </div>
      <div class={`w-2/3 text-white h-full flex flex-col p-5 pb-0 ${compileStatus() == CompilingStatus.READY ? "justify-center" : "justify-end"} items-center`}>
        <div id="logBox" class="w-full h-full h-max-full overflow-auto">
          <For each={eventLog}>
            {(log, _i) => <p class={`text-white ${log.startsWith("    ") ? "pl-3" : ""}`}>{log}</p>}
          </For>
        </div>
        <p class="text-red-400 font-bold">{errorMsg()}</p>
        <Show when={files.files.length > 0 || csv.length > 0}>
          <Show when={compileStatus() != CompilingStatus.FAILED}>
            <CompileButton files={files} csv={csv} setErrorMsg={setErrorMsg} keepRawData={keepRawData} compileStatus={compileStatus} setCompileStatus={setCompileStatus} />
          </Show>
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
