import { useParams } from "@solidjs/router";
import { Component, createEffect, createMemo, createSignal, For, onMount, Show } from "solid-js";
import { decode } from "../state";
import { githubKey, stripe_pk } from "../generated_app_info";
import { loadStripe } from "@stripe/stripe-js";
import Stepper from "../components/finish/stepper";
import { ProvisioningStatus } from "../types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Octokit } from "@octokit/core";
import { setTimeout } from "timers/promises";
import { delay } from "../misc";
import { getHtmlURLFromExistingJob, getJobAndURL, listenForEventCompletion, octokit } from "../components/finish/github_misc";

const FinishPage: Component<{}> = (props) => {
  const [email, setEmail] = createSignal<string>("");
  const [validatePayment, setValidatePayment] = createSignal(ProvisioningStatus.PENDING);
  const [createAccount, setCreateAccount] = createSignal(ProvisioningStatus.PENDING);
  const [createFirebase, setCreateFirebase] = createSignal(ProvisioningStatus.PENDING);
  const [createAzure, setCreateAzure] = createSignal(ProvisioningStatus.PENDING);
  const [createSite, setCreateSite] = createSignal(ProvisioningStatus.PENDING);
  const [complete, setComplete] = createSignal(ProvisioningStatus.PENDING);

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
        const results = await getJobAndURL(docIDthing());
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
      addStartingMessage(`Interactive viewer:`);
      addStartingMessage(htmlURL());
      addStartingMessage("Listening to provisioning runner...")
      const jobResults = await listenForEventCompletion(gitHubJobID()!);
      if (jobResults.firebase) {
        setCreateFirebase(ProvisioningStatus.SUCCEEDED);
        addStartingMessage("Database deploy succeeded");
      }
      else {
        setCreateFirebase(ProvisioningStatus.FAILED);
        addStartingMessage("Database deploy failed");
      }
      if (jobResults.azure) {
        setCreateAzure(ProvisioningStatus.SUCCEEDED);
        addStartingMessage("Azure deploy succeeded");
      }
      else {
        setCreateAzure(ProvisioningStatus.FAILED);
        addStartingMessage("Azure deploy failed");
      }
      if (jobResults.deploy) {
        setCreateSite(ProvisioningStatus.SUCCEEDED);
        addStartingMessage("Site deploy succeeded");
      }
      else {
        setCreateSite(ProvisioningStatus.FAILED);
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
        <p class="mb-12">You can close this page without interrupting the provisioning process</p>
        <div class="w-1/2 max-md:w-full h-full max-h-full overflow-auto text-start">
          <For each={logs()}>
            {(log, i) => {
              return <p>{log}</p>
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;
