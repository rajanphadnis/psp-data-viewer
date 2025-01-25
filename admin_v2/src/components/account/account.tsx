import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { useState } from "../../state";
import { User } from "firebase/auth";
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
    </div>
  );
};

export default AccountPage;
