import { Component, createSignal, Match, Setter, Switch } from "solid-js";
import { CompilingStatus, SelectedFile } from "../types";
import { SetStoreFunction } from "solid-js/store";
import { readAllTdmsChannels } from "../processing/read_all_tdms_channels";
import { invoke } from "@tauri-apps/api/core";

const CompileButton: Component<{
    files: {
        files: SelectedFile[];
    },
    setFiles: SetStoreFunction<{
        files: SelectedFile[];
    }>,
    setErrorMsg: Setter<string>
}> = (props) => {
    const [compileStatus, setCompileStatus] = createSignal(CompilingStatus.READY);

    return <button class={`p-3 rounded-lg font-bold text-black bg-amber-400 ${compileStatus() != CompilingStatus.READY ? "" : "hover:bg-amber-300 cursor-pointer"}`} onclick={async () => {
        if (compileStatus() == CompilingStatus.READY) {
            setCompileStatus(CompilingStatus.COMPILING);
            let processingPromises: Promise<void>[] = readAllTdmsChannels(props.files, props.setFiles, props.setErrorMsg);
            Promise.all(processingPromises).then(async () => {
                const flatMapChannels = props.files.files.flatMap((file_inner) => file_inner.groups.flatMap((group_inner) => group_inner.channels));
                let toResize = {};
                flatMapChannels.forEach((dat) => {
                    (toResize as any)[`${dat.channel_name}`] = dat.data;
                    (toResize as any)[`${dat.channel_name}_time`] = dat.time;
                });
                console.log(toResize);
                setCompileStatus(CompilingStatus.RESIZING);
                const resizeFxn: Promise<{}> = invoke("resize_data", { data: toResize }); // TODO: replace data passing here with writes to sql
                resizeFxn.then(async (toWrite) => {
                    setCompileStatus(CompilingStatus.SAVING);
                    const writeHDF5: Promise<boolean | string> = invoke("create_hdf5", { export_data: toWrite }); // TODO: replace data passing here with reads from sql
                    writeHDF5
                        .then(() => {
                            console.log("complete");
                            setCompileStatus(CompilingStatus.COMPLETE);
                        })
                        .catch((error) => {
                            props.setErrorMsg(error);
                        });
                }).catch((error) => {
                    props.setErrorMsg(error);
                });
            }).catch(() => console.log("Error compiling"));
        }
    }}>
        <Switch>
            <Match when={compileStatus() == CompilingStatus.COMPILING}>Collecting Data...</Match>
            <Match when={compileStatus() == CompilingStatus.RESIZING}>Resizing Tables...</Match>
            <Match when={compileStatus() == CompilingStatus.COMPLETE}>Complete</Match>
            <Match when={compileStatus() == CompilingStatus.READY}>Compile</Match>
            <Match when={compileStatus() == CompilingStatus.SAVING}>Saving...</Match>
        </Switch>
    </button>;
};

export default CompileButton;