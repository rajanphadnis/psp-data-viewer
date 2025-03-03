import { invoke } from "@tauri-apps/api/core";
import { Accessor, Component, Match, Setter, Switch } from "solid-js";
import { SetStoreFunction, unwrap } from "solid-js/store";
import { CompilingStatus, SelectedFile } from "../types";

const CompileButton: Component<{
    files: {
        files: SelectedFile[];
    },
    setFiles: SetStoreFunction<{
        files: SelectedFile[];
    }>,
    setErrorMsg: Setter<string>,
    keepRawData: Accessor<boolean>,
    compileStatus: Accessor<CompilingStatus>,
    setCompileStatus: Setter<CompilingStatus>
}> = (props) => {

    return <button class={`p-3 rounded-lg font-bold ${props.compileStatus() != CompilingStatus.READY ? "bg-transparent flex flex-row text-white justify-center items-center" : "text-black bg-amber-400 hover:bg-amber-300 cursor-pointer"}`} onclick={async () => {
        if (props.compileStatus() == CompilingStatus.READY) {
            props.setCompileStatus(CompilingStatus.COMPILING);
            const unwrappedFiles = unwrap(props.files);
            const calc_resize_save: Promise<[number, [number, number]]> = invoke("compile", { files: unwrappedFiles.files, save_raw_data: props.keepRawData() });
            calc_resize_save
                .then((res) => {
                    console.log("complete");
                    console.log(res);
                    props.setCompileStatus(CompilingStatus.COMPLETE);
                })
                .catch((error) => {
                    props.setErrorMsg(error);
                    props.setCompileStatus(CompilingStatus.FAILED);
                });
        }
    }}>
        <Switch>
            <Match when={props.compileStatus() == CompilingStatus.COMPILING}><p>Reading Channels...</p><div class="loader ml-5"></div></Match>
            <Match when={props.compileStatus() == CompilingStatus.RESIZING}><p>Resizing Tables...</p><div class="loader ml-5"></div></Match>
            <Match when={props.compileStatus() == CompilingStatus.FLATTENING}><p>Flattening Channels...</p><div class="loader ml-5"></div></Match>
            <Match when={props.compileStatus() == CompilingStatus.APPLYING_CALCS}><p>Applying Constants to Channels...</p><div class="loader ml-5"></div></Match>
            <Match when={props.compileStatus() == CompilingStatus.COMPLETE}>Complete</Match>
            <Match when={props.compileStatus() == CompilingStatus.READY}>Compile</Match>
            <Match when={props.compileStatus() == CompilingStatus.SAVING}><p>Saving...</p><div class="loader ml-5"></div></Match>
            <Match when={props.compileStatus() == CompilingStatus.FAILED}>Failed</Match>
        </Switch>
    </button>;
};

export default CompileButton;