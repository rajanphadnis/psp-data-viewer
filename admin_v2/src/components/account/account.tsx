import { User } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  Show
} from "solid-js";
import { useState } from "../../state";
import ExistingRequest from "../request/existing";
import RequestPermissionsComponent from "../request/main";
import PermissionsSection from "./permissions";

const AccountPage: Component<{}> = (props) => {
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
  const [currentUser, setCurrentUser] = createSignal<User | null | undefined>();
  const [currentPermissionRequest, setCurrentPermissionRequest] = createSignal<{
    code: string;
    status: string;
  }>();
  createEffect(() => {
    const perms = auth();
    console.debug(globalThis.auth.currentUser);
    console.debug(perms);
    setCurrentUser(globalThis.auth.currentUser);
    const currentUserEmail = globalThis.auth.currentUser?.email;
    const providerDataEmail =
      globalThis.auth.currentUser?.providerData[0].email;
    const email =
      currentUserEmail == undefined || currentUserEmail == null
        ? providerDataEmail!
        : currentUserEmail;
    console.log(auth());
  });

  createEffect(async () => {
    if (currentUser()) {
      const currentUserEmail = globalThis.auth.currentUser?.email;
      const providerDataEmail =
        globalThis.auth.currentUser?.providerData[0].email;
      const email =
        currentUserEmail == undefined || currentUserEmail == null
          ? providerDataEmail!
          : currentUserEmail;
      console.log(email);
      // let requestCode: string = "";
      // let status: string = "";
      onSnapshot(
        query(
          collection(globalThis.adminDB, "permissions_requests"),
          where("email", "==", email),
        ),
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            const requestCode = doc.data()["requestCode"];
            const status = doc.data()["status"];
            setCurrentPermissionRequest({
              code: requestCode,
              status: status,
            });
          });
        },
      );
      // const requestCode = await getExistingPermissionsRequests(email);
      // setCurrentPermissionRequest(requestCode);
    }
  });

  return (
    <div class="p-4">
      <h1 class="text-xl font-bold">Your Account:</h1>
      <p>
        Email Address:{" "}
        {currentUser() == null || currentUser() == undefined
          ? ""
          : (currentUser()?.email ??
            currentUser()?.providerData[0].email ??
            "No email")}
      </p>
      <p>
        Your permissions:{" "}
        {permissions() == null || permissions() == undefined
          ? ""
          : permissions()!.length == 0
            ? "No permissions. Request some below."
            : permissions()?.join(", ")}
      </p>
      <Show when={permissions()?.includes(`${org()}:manage:permissions`)}>
        <PermissionsSection />
        <UpdateAzureKey slug={org()!} />
      </Show>
      <Show
        when={
          permissions()! &&
          !permissions()!.includes(`${org()}:manage:permissions`)
        }
      >
        <Show
          when={currentPermissionRequest()}
          fallback={<RequestPermissionsComponent />}
        >
          <ExistingRequest
            requestCode={currentPermissionRequest()!.code}
            status={currentPermissionRequest()!.status}
          />
        </Show>
      </Show>
    </div>
  );
};

export default AccountPage;

const UpdateAzureKey: Component<{ slug: string }> = (props) => {
  const [loading, setLoading] = createSignal(false);

  return (
    <button
      class="mt-10 flex cursor-pointer flex-row items-center bg-red-600 p-3 font-bold text-white hover:bg-red-400"
      onclick={(e) => {
        if (!loading()) {
          setLoading(true);
          const updateAzureKey = httpsCallable(
            globalThis.functions,
            "update_azure_key",
          );
          updateAzureKey({ slug: props.slug }).then((result) => {
            // Read result of the Cloud Function.
            /** @type {any} */
            const data = result.data;
            console.log(data);
            setLoading(false);
          });
        }
      }}
    >
      <Show when={loading()} fallback={"Update Azure Access Key (Org-wide)"}>
        Updating...
        <div class="loader animate-spin-xtrafast ml-3 h-4 w-4 border-2 border-t-2 border-transparent border-t-black"></div>
      </Show>
    </button>
  );
};
