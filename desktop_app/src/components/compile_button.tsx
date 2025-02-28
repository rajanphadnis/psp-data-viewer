import { Component, createSignal, Match, Setter, Switch } from "solid-js";
import { CompilingStatus, ExportChannel, LoadingStatus, SelectedFile } from "../types";
import { writeHDF5 } from "../processing/write";
import { SetStoreFunction } from "solid-js/store";
import { fetchTDMSData } from "../processing/fetch";
import { readAllTdmsChannels } from "../processing/read_all_tdms_channels";

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
                let toWrite = {};
                flatMapChannels.forEach((dat) => {
                    (toWrite as any)[`${dat.channel_name}`] = dat.data;
                });
                console.log(toWrite);
                setCompileStatus(CompilingStatus.RESIZING);
                setCompileStatus(CompilingStatus.SAVING);
                await writeHDF5(toWrite, props.setErrorMsg);
                setCompileStatus(CompilingStatus.COMPLETE);
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