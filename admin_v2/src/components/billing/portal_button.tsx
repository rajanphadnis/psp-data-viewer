import { httpsCallable } from "firebase/functions";
import { Component, createSignal, Show } from "solid-js";
import OpenInNewTabIcon from "../icons/open_in_new_tab";
import { config } from "../../generated_app_check_secret";
import { useState } from "../../state";

const PortalButton: Component<{}> = (props) => {
  const [loading, setLoading] = createSignal<boolean>(false);
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
  return (
    <button
      class="flex flex-row p-5 bg-green-600 rounded-lg border-solid border-neutral-500 border hover:bg-green-500 font-bold w-fit h-fit items-center justify-center"
      onclick={() => {
        setLoading(true);
        const callFxn = httpsCallable(globalThis.functions, "fetchStripePortalLink");
        callFxn({ return_url: window.location.href, stripe_customer_id: (config as any)[org()!].stripe.customerID }).then((result) => {
          /** @type {any} */
          const data: any = result.data;
          const url = data.url;
          window.location = url;
          setLoading(false);
        });
      }}
    >
      Manage Billing
      <span class="m-0 p-0 ml-2">
        <Show when={loading()} fallback={<OpenInNewTabIcon />}>
          <div class="border-2 border-solid border-transparent rounded-[50%] border-t-2 border-t-white w-4 h-4 animate-spin-fast"></div>
        </Show>
      </span>
    </button>
  );
};

export default PortalButton;
