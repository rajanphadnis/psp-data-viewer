import { Component, createMemo, createSignal, For, onMount, Show } from "solid-js";
import {
  addPermission,
  deletePermission,
  fetchAvailablePermissions,
  fetchOrgPermissions,
} from "../../db/db_interaction";
import { useState } from "../../state";
import { AccessControlDoc, PermissionType } from "../../types";
import { doc, onSnapshot } from "firebase/firestore";
import AddPermission from "./dropdown";

const PermissionsSection: Component<{}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();
  const permissions = createMemo(() => auth());
  const [orgPermissions, setOrgPermissions] = createSignal<AccessControlDoc | undefined>();
  const [selectedEmail, setSelectedEmail] = createSignal<string | undefined>();
  const [allPerms, setAllPerms] = createSignal<PermissionType | undefined>();

  onMount(async () => {
    if (org()) {
      if (globalThis.adminDB) {
        const permsAndDescs = await fetchAvailablePermissions();
        setAllPerms(permsAndDescs);
        onSnapshot(doc(globalThis.adminDB, "access_control", "users"), (doc) => {
          const dat = doc.data()! as AccessControlDoc;
          let toReturn: AccessControlDoc = {};
          const keys = Object.keys(dat);
          keys.forEach((key) => {
            const list = dat[key].filter((val) => {
              return val.includes(org()!);
            });
            if (list.length > 0) {
              toReturn[key] = list;
            }
          });
          setOrgPermissions(toReturn);
        });
      }
    }
  });

  return (
    <div class="mt-8">
      <hr />
      <h1 class="text-xl font-bold mt-4">Organization Permissions</h1>
      <div class="flex flex-row w-full border border-white mt-4">
        <Show when={orgPermissions()}>
          <div class="flex flex-col w-1/2 border-r border-white">
            <For each={Object.keys(orgPermissions()!)}>
              {(email, index) => (
                <div class="flex flex-row border-b border-white">
                  <button
                    class={`hover:bg-neutral-400 p-3 w-max grow text-start ${
                      selectedEmail() == email ? "bg-neutral-500" : "bg-transparent"
                    }`}
                    onclick={() => {
                      if (selectedEmail() == email) {
                        setSelectedEmail();
                      } else {
                        setSelectedEmail(email);
                      }
                    }}
                  >
                    {email}
                  </button>
                  <button
                    class={`hover:bg-red-500 p-3 w-fit ${
                      selectedEmail() == email ? "bg-neutral-500" : "bg-transparent"
                    }`}
                    onclick={() => {
                      const perms = orgPermissions()![selectedEmail()!];
                      perms.forEach(async (perm) => {
                        await deletePermission(selectedEmail()!, perm);
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </For>
          </div>
          <div class="flex flex-col w-1/2">
            <Show when={selectedEmail()}>
              <For each={orgPermissions()![selectedEmail()!]}>
                {(perm, index) => (
                  <div class="flex flex-row border-b border-white">
                    <button class="hover:bg-neutral-400 p-3 grow text-start">{perm}</button>
                    <button
                      class="hover:bg-red-500 p-3 w-fit"
                      onclick={async () => {
                        await deletePermission(selectedEmail()!, perm);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </For>
            </Show>
          </div>
        </Show>
      </div>
      <div class="flex flex-row justify-between items-center">
        <button
          class="hover:bg-neutral-400 p-3 w-fit border border-white mt-3"
          onclick={async () => {
            const email = prompt("Enter email address of user to add:");
            const keys = Object.keys(allPerms()!);
            const firstPerm = keys[0];
            const orgPerm = `${org()!}:${firstPerm}`;
            if (email) {
              await addPermission(email, orgPerm);
            }
          }}
        >
          Add User
        </button>
        <Show when={selectedEmail()}>
          <AddPermission
            org={org}
            orgPermissions={orgPermissions}
            selectedEmail={selectedEmail}
            allPerms={allPerms()}
          />
        </Show>
      </div>
    </div>
  );
};

export default PermissionsSection;
