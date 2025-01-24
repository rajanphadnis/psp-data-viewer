import { Component, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { fetchOrgPermissions } from "../../db/db_interaction";
import { useState } from "../../state";
import { AccessControlDoc } from "../../types";

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

  onMount(async () => {
    if (org()) {
      if (globalThis.adminDB) {
        setOrgPermissions(await fetchOrgPermissions(org()!));
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
                    class={`hover:bg-neutral-400 p-3 w-max flex-grow text-start ${
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
                    <button class="hover:bg-neutral-400 p-3 flex-grow text-start">{perm}</button>
                    <button class="hover:bg-red-500 p-3 w-fit">Delete</button>
                  </div>
                )}
              </For>
            </Show>
          </div>
        </Show>
      </div>
      <div class="flex flex-row justify-between items-center">
        <button class="hover:bg-neutral-400 p-3 w-fit border border-white mt-3">Add User</button>
        <Show when={selectedEmail()}>
          <button class="hover:bg-neutral-400 p-3 w-fit border border-white mt-3">Add Permission</button>
        </Show>
      </div>
    </div>
  );
};

export default PermissionsSection;
