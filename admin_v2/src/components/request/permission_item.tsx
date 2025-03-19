import { Component, Show } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

const PermissionListItem: Component<{
  perm: string;
  desc: string;
  updateSelectionStatus: SetStoreFunction<string[]>;
  selectedPermissions: string[];
}> = (props) => {
  return (
    <div class="flex flex-row items-center justify-between border bg-transparent p-0 text-sm text-white">
      <div class="flex w-full flex-row items-center justify-start p-0">
        <p class="w-1/5 border-r p-2">{props.perm}</p>
        <p class="w-4/5 border-r p-2">{props.desc}</p>
      </div>
      <Show
        when={props.selectedPermissions.includes(props.perm)}
        fallback={
          <button
            class="hover:bg-cool-grey w-fit cursor-pointer p-2 font-bold whitespace-nowrap"
            onclick={(e) => {
              props.updateSelectionStatus((prev) => [...prev, props.perm]);
            }}
          >
            Add to Request
          </button>
        }
      >
        <button
          class="hover:bg-cool-grey w-fit cursor-pointer p-2 font-bold whitespace-nowrap"
          onclick={(e) => {
            props.updateSelectionStatus((prev) =>
              prev.filter((perm) => perm !== props.perm),
            );
          }}
        >
          Remove from Request
        </button>
      </Show>
    </div>
  );
};

export default PermissionListItem;
