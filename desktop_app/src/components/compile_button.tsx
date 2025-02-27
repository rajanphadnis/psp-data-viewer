import { Component, createSignal, Match, Setter, Switch } from "solid-js";
import { CompilingStatus, ExportChannel, LoadingStatus, SelectedFile } from "../types";
import { writeHDF5 } from "../processing/write";
import { SetStoreFunction } from "solid-js/store";
import { fetchTDMSData } from "../processing/fetch";

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

    // const channels = createMemo(() => {
    //     let thing = props.files.files.flatMap((file) => file.groups.flatMap((group) => group.channels.filter((channel) => channel.data != undefined)));
    //     return thing;
    // });

    return <button class={`p-3 rounded-lg font-bold text-black bg-amber-400 ${compileStatus() != CompilingStatus.READY ? "" : "hover:bg-amber-300 cursor-pointer"}`} onclick={async () => {
        if (compileStatus() == CompilingStatus.READY) {
            setCompileStatus(CompilingStatus.COMPILING);
            let processingPromises: Promise<void>[] = [];
            props.files.files.forEach((file) => {
                file.groups.forEach((group) => {
                    group.channels.forEach((channel) => {
                        const channelPromise: Promise<void> = new Promise(async (resolve, reject) => {
                            props.setFiles(
                                "files",
                                (file_filter) => file_filter.path == file.path,
                                "groups",
                                (group_filter) => group_filter.groupName == group.groupName,
                                "channels",
                                (channel_filter) => channel_filter.channel_name == channel.channel_name,
                                "state",
                                LoadingStatus.LOADING
                            );
                            await fetchTDMSData(props.setFiles, props.setErrorMsg, file.path, group.groupName, channel.channel_name);
                            console.log(`processing: ${channel.channel_name}`);
                            props.setFiles(
                                "files",
                                (file_filter) => file_filter.path == file.path,
                                "groups",
                                (group_filter) => group_filter.groupName == group.groupName,
                                "channels",
                                (channel_filter) => channel_filter.channel_name == channel.channel_name,
                                "state",
                                LoadingStatus.FINISHED
                            );
                            resolve();
                        });
                        processingPromises.push(channelPromise);
                    });
                });
            });
            console.log("processing");
            console.log(processingPromises);
            Promise.all(processingPromises).then(async () => {
                const flatMapChannels = props.files.files.flatMap((file_inner) => file_inner.groups.flatMap((group_inner) => group_inner.channels));
                // let toWrite: ExportChannel[] = [];
                // flatMapChannels.forEach((channel_inner) => {
                //     const new_channel: ExportChannel = { channel_name: channel_inner.channel_name, data: channel_inner.data! };
                //     toWrite.push(new_channel);
                // });
                let toWrite = {};
                flatMapChannels.forEach((dat) => {
                    (toWrite as any)[`${dat.channel_name}`] = dat.data;
                });
                console.log(toWrite);
                setCompileStatus(CompilingStatus.SAVING);
                await writeHDF5(toWrite, props.setErrorMsg);
                setCompileStatus(CompilingStatus.COMPLETE);
            }).catch(() => console.log("Error compiling"));
        }
    }}>
        <Switch>
            <Match when={compileStatus() == CompilingStatus.COMPILING}>Compiling...</Match>
            <Match when={compileStatus() == CompilingStatus.COMPLETE}>Complete</Match>
            <Match when={compileStatus() == CompilingStatus.READY}>Compile</Match>
            <Match when={compileStatus() == CompilingStatus.SAVING}>Saving...</Match>
        </Switch>
    </button>;
};

export default CompileButton;