import { Component, createMemo, Match, Setter, Switch } from "solid-js";
import { LoadingStatus, SelectedFile } from "../types";
import { fetchTDMSData } from "../processing/fetch";
import { SetStoreFunction } from "solid-js/store";

const ChannelButton: Component<{
    files: {
        files: SelectedFile[];
    },
    setFiles: SetStoreFunction<{
        files: SelectedFile[];
    }>,
    setErrorMsg: Setter<string>
    path: string,
    groupName: string,
    channel_name: string
}> = (props) => {

    const loading_status = createMemo(() => {
        return props.files.files.filter((file) => file.path == props.path)[0].groups.filter((group) => group.group_name == props.groupName)[0].channels.filter((channel) => channel.channel_name == props.channel_name)[0].state;

    });

    const conditionalCSS = createMemo(() => {
        switch (loading_status()) {
            case LoadingStatus.LOADING:
                return "bg-orange-400 hover:bg-orange-300";

            case LoadingStatus.LOADED:
                return "bg-amber-400 hover:bg-amber-300";

            case LoadingStatus.CALC:
                return "bg-yellow-400 hover:bg-yellow-300";

            case LoadingStatus.RESIZE:
                return "bg-lime-400 hover:bg-lime-300";

            case LoadingStatus.FINISHED:
                return "bg-green-700 hover:bg-green-600";

            default:
                return "cursor-pointer hover:bg-neutral-400";
        }
    });

    return <div class="ml-3">
        <button class={`w-full text-start ${conditionalCSS()}`} onclick={async () => {
            if (loading_status() == LoadingStatus.UNLOADED) {
                props.setFiles(
                    "files",
                    (file) => file.path == props.path,
                    "groups",
                    (group) => group.group_name == props.groupName,
                    "channels",
                    (channel) => channel.channel_name == props.channel_name,
                    "state",
                    LoadingStatus.LOADING
                );
                await fetchTDMSData(props.setFiles, props.files, props.setErrorMsg, props.path, props.groupName, props.channel_name);
                props.setFiles(
                    "files",
                    (file) => file.path == props.path,
                    "groups",
                    (group) => group.group_name == props.groupName,
                    "channels",
                    (channel) => channel.channel_name == props.channel_name,
                    "state",
                    LoadingStatus.FINISHED
                );
            }
        }}>
            <Switch>
                <Match when={loading_status() == LoadingStatus.LOADING}>{props.channel_name} (Loading...)</Match>
                <Match when={loading_status() == LoadingStatus.UNLOADED}>{props.channel_name}</Match>
                <Match when={loading_status() == LoadingStatus.FINISHED}>{props.channel_name}</Match>
                <Match when={loading_status() == LoadingStatus.LOADED}>{props.channel_name} (Loaded)</Match>
                <Match when={loading_status() == LoadingStatus.CALC}>{props.channel_name} (Applying Calcs...)</Match>
                <Match when={loading_status() == LoadingStatus.RESIZE}>{props.channel_name} (Resizing...)</Match>
            </Switch></button>
    </div>;
};

export default ChannelButton;