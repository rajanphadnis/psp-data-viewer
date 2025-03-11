import { Accessor, Component, Setter } from "solid-js";
import { humanFileSize } from "../../../browser_interactions";
import TrashIcon from "../../icons/trash";

const ListedFileComponent: Component<{
  setFilePath: Setter<File | undefined>
  filePath: Accessor<File | undefined>;
}> = (props) => {
  return (
    <div class="flex flex-row justify-between items-center py-2.5">
      <p class="w-auto">Selected Test File: {props.filePath()!.name} ({humanFileSize(props.filePath()!.size)})</p>
      <button
        class="ml-3 bg-rush hover:bg-rush-light cursor-pointer px-3 py-3 mr-2"
        on:click={() => {
          props.setFilePath(undefined);
        }}
      >
        <TrashIcon />
      </button>
    </div>
  );
};

export default ListedFileComponent;
