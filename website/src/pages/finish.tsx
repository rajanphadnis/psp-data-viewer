import { Component, createEffect, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { decode } from "../state";
import { stripe_pk } from "../generated_app_info";
import { loadStripe } from "@stripe/stripe-js";
import Stepper from "../components/finish/stepper";
import { ProvisioningStatus } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { getHtmlURLFromExistingJob, getJobAndURL, listenForEventCompletion } from "../components/finish/github_misc";
import OpenIcon from "../components/icons/open";
import Popover from "@corvu/popover";
import HelpIcon from "../components/icons/help";

const FinishPage: Component<{}> = (props) => {
  const [email, setEmail] = createSignal<string>("");
  const [validatePayment, setValidatePayment] = createSignal(ProvisioningStatus.PENDING);
  const [createAccount, setCreateAccount] = createSignal(ProvisioningStatus.PENDING);
  const [createFirebase, setCreateFirebase] = createSignal(ProvisioningStatus.PENDING);
  const [createAzure, setCreateAzure] = createSignal(ProvisioningStatus.PENDING);
  const [createSite, setCreateSite] = createSignal(ProvisioningStatus.PENDING);
  const [complete, setComplete] = createSignal(ProvisioningStatus.PENDING);
  const [slug, setSlug] = createSignal<string>("");
  const [customerID, setCustomerID] = createSignal<string>("");
  const [startingMessages, setStartingMessages] = createSignal<string[]>([]);
  const [docIDthing, setDocID] = createSignal<string>("");
  const [githubMessages, setGithubMessages] = createSignal<string>("");
  const [gitHubJobID, setGitHubJobID] = createSignal<number>();
  const [endingMessages, setEndingMessages] = createSignal<string[]>([]);
  const [htmlURL, setHtmlURL] = createSignal<string>("");

  function addStartingMessage(log: string) {
    const current = startingMessages();
    const newList = [...current, log];
    setStartingMessages(newList);
  }

  createEffect(() => {
    if (githubMessages().includes("dv-log:::firebase-complete")) {
      setCreateFirebase(ProvisioningStatus.SUCCEEDED);
    }
    if (githubMessages().includes("dv-log:::azure-complete")) {
      setCreateAzure(ProvisioningStatus.SUCCEEDED);
    }
    if (githubMessages().includes("dv-log:::deploy-complete")) {
      setCreateSite(ProvisioningStatus.SUCCEEDED);
    }
  });

  const logs = createMemo(() => {
    const ghMessages = githubMessages().split("\n").filter((val) => val.includes("dv-log:::"));
    return [...startingMessages(), ...ghMessages, ...endingMessages()];
  });

  // http://localhost:3000/finish/cmFqYW5zZDI4QGdtYWlsLmNvbTo6OnNldGlfMVF1cXYzTDZoemlERDc1Y3RCR1Z6RHRMX3NlY3JldF9Sb1RzWjl6UTAyUDlkTXVFRFRIRkVDWXN4ZFozRmxoOjo6U2I3VXVxam4xcm5nbHFxU1FQWkM=?setup_intent=seti_1Quqv3L6hziDD75ctBGVzDtL&setup_intent_client_secret=seti_1Quqv3L6hziDD75ctBGVzDtL_secret_RoTsZ9zQ02P9dMuEDTHFECYsxdZ3Flh&redirect_status=succeeded

  onMount(async () => {
    addStartingMessage("Validating Accounts...");
    // addLog("");
    const params = window.location.pathname.slice(8).split("?")[0];
    const splitParams = decode(params).split(":::");
    setEmail(splitParams[0]);
    setDocID(splitParams[2]);
    const stripe = await loadStripe(stripe_pk);
    setValidatePayment(ProvisioningStatus.DEPLOYING);
    stripe!.retrieveSetupIntent(splitParams[1]).then(({ setupIntent }) => {
      switch (setupIntent!.status) {
        case "succeeded": {
          addStartingMessage("STRIPE: Payment method saved!");
          setValidatePayment(ProvisioningStatus.SUCCEEDED);
          break;
        }

        case "processing": {
          addStartingMessage("STRIPE: Payment method processing. Unable to verify immediately.")
          setValidatePayment(ProvisioningStatus.FAILED);
          break;
        }

        case "requires_payment_method": {
          addStartingMessage("STRIPE: Failed to process payment details. Please go back and try another payment method")
          setValidatePayment(ProvisioningStatus.FAILED);
          // Redirect your user back to your payment page to attempt collecting
          // payment again

          break;
        }
      }
    });
  });

  createEffect(async () => {
    if (validatePayment() == ProvisioningStatus.SUCCEEDED && docIDthing() != "") {
      setCreateAccount(ProvisioningStatus.PENDING);
      const docRef = doc(globalThis.db, "temp_accounts", docIDthing());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        addStartingMessage(`FIREBASE: Validated customer doc (${docIDthing()})`);
        const data = docSnap.data();
        setGitHubJobID(data["github_jobID"]);
        setHtmlURL(data["github_html_url"]);
        setSlug(data["slug"])
        setCustomerID(data["customerID"]);
        setCreateAccount(ProvisioningStatus.SUCCEEDED);
        startInstanceDeploy();
      } else {
        // docSnap.data() will be undefined in this case
        addStartingMessage(`FIREBASE: Could not find docment: ${docIDthing()}`);
        setCreateAccount(ProvisioningStatus.FAILED);
      }
    }
  });

  async function startInstanceDeploy() {
    if (createAccount() == ProvisioningStatus.SUCCEEDED && createFirebase() != ProvisioningStatus.DEPLOYING) {
      setCreateFirebase(ProvisioningStatus.DEPLOYING);
      setCreateAzure(ProvisioningStatus.DEPLOYING);
      setCreateSite(ProvisioningStatus.DEPLOYING);
      if (gitHubJobID() == undefined) {
        addStartingMessage("Starting new runner...");
        const results = await getJobAndURL(docIDthing(), slug(), customerID());
        if (results != undefined) {
          setGitHubJobID(results.jobID);
          setHtmlURL(results.html_url);
        }
        else {
          addStartingMessage("Failed to launch interactive log viewer. Your deployment probably already started (to confirm, look for a deployment job on our repo's Actions tab)");
        }
      }
      else {
        addStartingMessage("Reading existing runner...");
        if (htmlURL() == "") {
          const htmlURL = await getHtmlURLFromExistingJob(gitHubJobID()!);
          setHtmlURL(htmlURL);
        }
      }
      // addStartingMessage(`Interactive viewer:`);
      addStartingMessage(`[Stream deploy logs](${htmlURL()})`);
      addStartingMessage("Listening to provisioning runner...")
      await listenForEventCompletion(gitHubJobID()!, setCreateFirebase, setCreateAzure, setCreateSite);
      if (createFirebase() == ProvisioningStatus.SUCCEEDED) {
        addStartingMessage("Database deploy succeeded");
      }
      else {
        addStartingMessage("Database deploy failed");
      }
      if (createAzure() == ProvisioningStatus.SUCCEEDED) {
        addStartingMessage("Azure deploy succeeded");
      }
      else {
        addStartingMessage("Azure deploy failed");
      }
      if (createSite() == ProvisioningStatus.SUCCEEDED) {
        addStartingMessage("Site deploy succeeded");
      }
      else {
        addStartingMessage("Site deploy failed");
      }
    }
  };

  createEffect(() => {
    if (createSite() == ProvisioningStatus.SUCCEEDED) {
      setComplete(ProvisioningStatus.SUCCEEDED);
    }
  });

  return (
    <div class="flex flex-row w-full h-full justify-start items-center text-center">
      <div class="pl-10 h-full flex flex-col justify-center">
        <Stepper validatePayment={validatePayment} createAccount={createAccount} createAzure={createAzure} createFirebase={createFirebase} createSite={createSite} complete={complete} />
      </div>
      <div class="w-full h-full flex flex-col justify-start items-center px-24 pt-24">
        <h1 class="text-xl font-bold mb-4">Deploying and Provisioning Instance:</h1>
        <Show when={createFirebase() != ProvisioningStatus.PENDING} fallback={<p class="my-6">Do not close or refresh this page</p>}>
          {/* <div class="flex flex-row justify-center items-center"> */}
          <p class="my-6 w-3/4">You can now close this page without interrupting the provisioning process. Make sure to bookmark this page or save the URL
            <Popover
              floatingOptions={{
                offset: 13,
                flip: true,
                shift: true,
              }}
            >
              <Popover.Trigger class="my-auto mx-3 rounded-full bg-neutral-500 p-1 transition-all duration-100 hover:bg-neutral-600 active:translate-y-0.5 cursor-pointer">
                <HelpIcon class="fill-white w-3 h-3" />
                <span class="sr-only">Help</span>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content class="z-50 rounded-lg bg-neutral-500 px-3 py-2 shadow-md data-open:animate-in data-open:fade-in-50% data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-50% data-closed:slide-out-to-top-1 text-center">
                  <p>This URL is unique to your deployment process</p>
                  {/* <br/> */}
                  <p>Without this URL, you won't be able to check on the status of this deployment again</p>
                  <Popover.Arrow class="text-neutral-500" />
                </Popover.Content>
              </Popover.Portal>
            </Popover></p>
          {/* </div> */}
        </Show>
        <div class="w-2/3 max-md:w-full h-full max-h-full overflow-auto text-start">
          <For each={logs()}>
            {(log, i) => {
              if (log.includes("(https://")) {
                const txt = log.substring(1).split("](");
                const link = txt[1].split(")")[0];
                return <a href={link} target="_blank" class="underline underline-offset-2 flex flex-row items-center">{txt[0]}<OpenIcon class="fill-white w-3 h-3 ml-2" /></a>
              }
              return <p>{log}</p>
            }}
          </For>
        </div>
      </div>
      <Show when={complete() == ProvisioningStatus.SUCCEEDED}>
        <div class="absolute bottom-0 right-0 p-6">
          <a href="https://admin.dataviewer.space" target="_blank">
            <button class="p-3 bg-amber-400 rounded-lg text-black font-bold whitespace-nowrap cursor-pointer hover:bg-amber-300 hover:shadow-2xl">Open Admin Console</button>
          </a>
        </div>
      </Show>
    </div>
  );
};

export default FinishPage;
