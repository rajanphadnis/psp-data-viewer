import { doc, onSnapshot } from "firebase/firestore";
import {
  Component,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  fetchAvailablePermissions,
  newPermissionRequest,
} from "../../db/db_interaction";
import { useState } from "../../state";
import { AccessControlDoc, PermissionType } from "../../types";
import PermissionListItem from "./permission_item";

const RequestPermissionsComponent: Component<{}> = (props) => {
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
  const [selectedPermissions, setSelectedPermissions] = createStore<string[]>(
    [],
  );
  const [allPerms, setAllPerms] = createSignal<PermissionType>();
  const [existingUserPerms, setExistingUserPerms] = createSignal<string[]>();
  const [completedRequest, setCompleted] = createSignal<boolean>();
  onMount(async () => {
    if (org()) {
      if (globalThis.adminDB) {
        const permsAndDescs = await fetchAvailablePermissions();
        setAllPerms(permsAndDescs);
        console.debug(permsAndDescs);
        onSnapshot(
          doc(globalThis.adminDB, "access_control", "users"),
          (doc) => {
            const dat = doc.data()! as AccessControlDoc;
            let userPerms: string[] = [];
            const currentUserEmail = globalThis.auth.currentUser?.email;
            const providerDataEmail =
              globalThis.auth.currentUser?.providerData[0].email;
            const email =
              currentUserEmail == undefined || currentUserEmail == null
                ? providerDataEmail!
                : currentUserEmail;
            console.log(email);
            if (dat[email]) {
              const list = dat[email].filter((permission) => {
                return permission.includes(org()!);
              });
              if (list.length > 0) {
                userPerms = list;
                setExistingUserPerms(userPerms);
              }
            }
          },
        );
      }
    }
  });

  const permsToShow = createMemo(() => {
    console.debug(allPerms());
    console.debug(existingUserPerms());
    if (allPerms()) {
      const allPermissionsClauses = Object.keys(allPerms()!);
      const allPermissions = allPermissionsClauses.map(function (clause) {
        return {
          perm: `${org()!}:${clause}`,
          desc: allPerms()![clause],
        };
      });
      const toShow = allPermissions.filter((perm) => {
        if (existingUserPerms()) {
          const includes = existingUserPerms()!.includes(perm.perm);
          console.log(includes);
          return !includes;
        } else {
          return true;
        }
      });
      return toShow;
    }
  });

  return (
    <div class="mt-5">
      <h1 class="mb-1 text-xl font-bold">Request Permissions:</h1>
      <For each={permsToShow()}>
        {(perm, i) => (
          <PermissionListItem
            perm={perm.perm}
            desc={perm.desc}
            updateSelectionStatus={setSelectedPermissions}
            selectedPermissions={selectedPermissions}
          />
        )}
      </For>
      <Show when={selectedPermissions.length > 0}>
        <p class="mt-5 mb-2">
          Request the following permissions: {selectedPermissions.join(", ")}
        </p>

        <button
          class="cursor-pointer bg-amber-400 p-3 font-bold text-black hover:bg-amber-300"
          onclick={async (e) => {
            if (completedRequest() == undefined) {
              setCompleted(false);
              const currentUserEmail = globalThis.auth.currentUser?.email;
              const providerDataEmail =
                globalThis.auth.currentUser?.providerData[0].email;
              const email =
                currentUserEmail == undefined || currentUserEmail == null
                  ? providerDataEmail!
                  : currentUserEmail;
              const completed = await newPermissionRequest(
                selectedPermissions,
                email,
                org()!,
              );
              if (completed == false) {
                alert("Failed to send request");
              } else {
                setCompleted(completed == true ? true : undefined);
              }
            }
          }}
        >
          <Show
            when={completedRequest() == undefined}
            fallback={
              <Show when={completedRequest() == true} fallback={"Loading"}>
                Completed
              </Show>
            }
          >
            Request
          </Show>
        </button>
      </Show>
    </div>
  );
};

export default RequestPermissionsComponent;
