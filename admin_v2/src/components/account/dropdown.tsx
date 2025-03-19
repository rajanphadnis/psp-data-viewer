import "@thisbeyond/solid-select/style.css";
import { Accessor, Component, createEffect, createSignal, For, Show } from "solid-js";
import { addPermission } from "../../db/db_interaction";
import { AccessControlDoc, PermissionType } from "../../types";
import "./dropdown_styling.css";

const AddPermission: Component<{
  org: Accessor<string | undefined>;
  orgPermissions: Accessor<AccessControlDoc | undefined>;
  selectedEmail: Accessor<string | undefined>;
  allPerms: PermissionType | undefined;
}> = (props) => {
  const [perms, setPerms] = createSignal<string[] | undefined>();

  createEffect(async () => {
    const permsAndDescs = props.allPerms!;
    const perms = Object.keys(permsAndDescs);
    const userPerms = props.orgPermissions()![props.selectedEmail()!];
    if (userPerms) {
      if (userPerms.length > 0) {
        const filteredPerms = perms.filter((perm) => {
          const orgPerm = `${props.org()!}:${perm}`;
          const includesPerm = userPerms.includes(orgPerm);
          return !includesPerm;
        });
        setPerms(filteredPerms);
      }
    }
  });

  return (
    <Show when={perms() && perms()!.length > 0}>
      <div class="relative inline-block group">
        <button class="hover:bg-neutral-400 p-3 w-fit border border-white mt-3">Add Permission</button>
        <div class="absolute hidden z-10 group-hover:block right-0">
          <For each={perms()}>
            {(perm, index) => (
              <div
                class="p-2 bg-white text-black hover:bg-neutral-300 hover:cursor-pointer"
                onclick={async () => {
                  await addPermission(props.selectedEmail()!, `${props.org()!}:${perm}`);
                }}
              >
                <p>{perm}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

export default AddPermission;
