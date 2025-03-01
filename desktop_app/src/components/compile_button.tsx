import { Accessor, Component, createSignal, Match, Setter, Switch } from "solid-js";
import { CompilingStatus, SelectedFile } from "../types";
import { SetStoreFunction, unwrap } from "solid-js/store";
import { readAllTdmsChannels } from "../processing/read_all_tdms_channels";
import { invoke } from "@tauri-apps/api/core";
import { stackAndFlatten } from "../processing/stack_and_flatten_datasets";
import { apply_calcs } from "../processing/apply_calcs";

const CompileButton: Component<{
    files: {
        files: SelectedFile[];
    },
    setFiles: SetStoreFunction<{
        files: SelectedFile[];
    }>,
    setErrorMsg: Setter<string>,
    keepRawData: Accessor<boolean>
}> = (props) => {
    const [compileStatus, setCompileStatus] = createSignal(CompilingStatus.READY);

    return <button class={`p-3 rounded-lg font-bold text-black bg-amber-400 ${compileStatus() != CompilingStatus.READY ? "" : "hover:bg-amber-300 cursor-pointer"}`} onclick={async () => {
        if (compileStatus() == CompilingStatus.READY) {
            setCompileStatus(CompilingStatus.COMPILING);
            let processingPromises: Promise<void>[] = readAllTdmsChannels(props.files, props.setFiles, props.setErrorMsg);
            Promise.all(processingPromises).then(async () => {
                setCompileStatus(CompilingStatus.FLATTENING);
                const unwrappedFiles = unwrap(props.files);
                const toApplyCalcs = await stackAndFlatten(unwrappedFiles, props.setErrorMsg);
                console.log(toApplyCalcs); // This isn't an array for some reason - it's an...object? Proxy(Array) {0: 1.5884974903351614, 1: 1.5960570886907879
                setCompileStatus(CompilingStatus.APPLYING_CALCS);
                const toResize = await apply_calcs(unwrappedFiles, toApplyCalcs, props.setErrorMsg, props.keepRawData());
                console.log(toResize);
                setCompileStatus(CompilingStatus.RESIZING);
                const resizeFxn: Promise<{}> = invoke("resize_data", { data: toResize });
                resizeFxn.then(async (toWrite) => {
                    setCompileStatus(CompilingStatus.SAVING);
                    const writeHDF5: Promise<boolean | string> = invoke("create_hdf5", { export_data: toWrite });
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
            <Match when={compileStatus() == CompilingStatus.COMPILING}>Reading Channels...</Match>
            <Match when={compileStatus() == CompilingStatus.RESIZING}>Resizing Tables...</Match>
            <Match when={compileStatus() == CompilingStatus.FLATTENING}>Flattening Channels...</Match>
            <Match when={compileStatus() == CompilingStatus.APPLYING_CALCS}>Applying Constants to Channels...</Match>
            <Match when={compileStatus() == CompilingStatus.COMPLETE}>Complete</Match>
            <Match when={compileStatus() == CompilingStatus.READY}>Compile</Match>
            <Match when={compileStatus() == CompilingStatus.SAVING}>Saving...</Match>
        </Switch>
    </button>;
};

export default CompileButton;