import { useParams } from "@solidjs/router";
import { httpsCallable } from "firebase/functions";
import { Component, createSignal, onMount } from "solid-js";
import { decode } from "../../browser_interactions";

const ProcessRequest: Component<{}> = (props) => {
  const params = useParams();
  const [loadingStatus, setLoadingStatus] = createSignal("Loading...");

  onMount(() => {
    const requestCode = params.requestCode;
    const approve = params.approve;
    console.debug(requestCode);
    console.debug(approve);
    const email = decode(requestCode).split(":::")[0];
    if (approve == "approve" || approve == "deny") {
      if (approve == "approve") {
        setLoadingStatus("Approving Request...");
        const applyPermissionsDecision = httpsCallable(
          globalThis.functions,
          "handle_permissions_decision",
        );
        applyPermissionsDecision({
          decision: true,
          email: email,
          slug: params.org,
        }).then((result) => {
          const res: boolean = result.data as boolean;
          if (res) {
            setLoadingStatus("Request Approved. You can now close this tab");
          } else {
            setLoadingStatus(
              "Failed to complete request (approve permissions). Try again in a few minutes.",
            );
          }
        });
      } else {
        setLoadingStatus("Denying Request...");
        const applyPermissionsDecision = httpsCallable(
          globalThis.functions,
          "handle_permissions_decision",
        );
        applyPermissionsDecision({
          decision: false,
          email: email,
          slug: params.org,
        }).then((result) => {
          const res: boolean = result.data as boolean;
          if (res) {
            setLoadingStatus("Request Denied. You can now close this tab");
          } else {
            setLoadingStatus(
              "Failed to complete request (deny permissions). Try again in a few minutes.",
            );
          }
        });
      }
    } else {
      setLoadingStatus("Mismatched URL schema - decision failed");
    }
  });

  return (
    <div class="m-0 flex h-full w-full flex-col items-center justify-center p-0 text-center">
      <p>{loadingStatus()}</p>
    </div>
  );
};

export default ProcessRequest;
