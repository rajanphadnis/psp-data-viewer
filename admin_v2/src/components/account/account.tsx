import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { useState } from "../../state";
import { User } from "firebase/auth";
import PermissionsSection from "./permissions";
import { httpsCallable } from "firebase/functions";

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
  createEffect(() => {
    const perms = auth();
    console.debug(perms);
    setCurrentUser(globalThis.auth.currentUser);
  });

  return (
    <div class="p-4">
      <h1 class="text-xl font-bold">Your Account:</h1>
      <p>Email Address: {currentUser()?.email}</p>
      <p>Your permissions: {permissions()?.join(", ")}</p>
      <Show when={permissions()?.includes(`${org()}:manage:permissions`)}>
        <PermissionsSection />
      </Show>
      <UpdateAzureKey slug={org()!} />
    </div>
  );
};

export default AccountPage;


const UpdateAzureKey: Component<{ slug: string }> = (props) => {
  const [loading, setLoading] = createSignal(false);

  return <button
    class="p-3 bg-red-600 hover:bg-red-400 cursor-pointer text-white font-bold mt-10 flex flex-row items-center"
    onclick={(e) => {
      if (!loading()) {
        setLoading(true);
        const updateAzureKey = httpsCallable(globalThis.functions, 'update_azure_key');
        updateAzureKey({ slug: props.slug })
          .then((result) => {
            // Read result of the Cloud Function.
            /** @type {any} */
            const data = result.data;
            console.log(data);
            setLoading(false);
          });
      }
    }}>
    <Show when={loading()} fallback={"Update Azure Access Key (Org-wide)"}>
      Updating...<div class=" ml-3 loader animate-spin-xtrafast w-4 h-4 border-t-2 border-2 border-t-black border-transparent"></div>
    </Show>
  </button>;
};