import { useParams } from "@solidjs/router";
import { Component, createEffect, createMemo, createSignal, For, onMount } from "solid-js";
import { decode } from "../state";
import { githubKey, stripe_pk } from "../generated_app_info";
import { loadStripe } from "@stripe/stripe-js";
import Stepper from "../components/finish/stepper";
import { ProvisioningStatus } from "../types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Octokit } from "@octokit/core";
import { setTimeout } from "timers/promises";
import { delay } from "../misc";

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

  const octokit = new Octokit({
    auth: githubKey
  })

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
    // if (ghMessages.includes("dv-log:::firebase-complete")) {
    //   setCreateFirebase(ProvisioningStatus.SUCCEEDED);
    // }
    // if (ghMessages.includes("dv-log:::azure-complete")) {
    //   setCreateAzure(ProvisioningStatus.SUCCEEDED);
    // }
    // if (ghMessages.includes("dv-log:::deploy-complete")) {
    //   setCreateSite(ProvisioningStatus.SUCCEEDED);
    // }
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
          addStartingMessage("STRIPE: Failed to process payment details. Please try another payment method")
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
        setCreateAccount(ProvisioningStatus.SUCCEEDED);
      } else {
        // docSnap.data() will be undefined in this case
        addStartingMessage(`FIREBASE: Could not find docment: ${docIDthing()}`);
        setCreateAccount(ProvisioningStatus.FAILED);
      }
    }
  });

  createEffect(async () => {
    if (createAccount() == ProvisioningStatus.SUCCEEDED && createFirebase() != ProvisioningStatus.DEPLOYING) {
      setCreateFirebase(ProvisioningStatus.DEPLOYING);
      if (gitHubJobID() == undefined) {
        addStartingMessage("Starting new runner...");
        await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
          owner: 'rajanphadnis',
          repo: 'psp-data-viewer',
          workflow_id: 'create_instance.yml',
          ref: 'main',
          inputs: {
            docID: docIDthing(),
          },
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        const send = await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
          owner: 'rajanphadnis',
          repo: 'psp-data-viewer',
          event: 'workflow_dispatch',
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        console.log(send);
        console.log(send.data.workflow_runs[0].id);
        const job = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
          owner: 'rajanphadnis',
          repo: 'psp-data-viewer',
          run_id: send.data.workflow_runs[0].id,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        console.log(job);
        console.log(job.data.jobs[0].id);
        setGitHubJobID(job.data.jobs[0].id);
        const docRef = doc(globalThis.db, "temp_accounts", docIDthing());
        await updateDoc(docRef, {
          github_jobID: job.data.jobs[0].id
        });
        for (let i = 0; i < 20; i++) {
          console.log(i);
          await delay(5000);
          const req = await octokit.request('GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs', {
            owner: 'rajanphadnis',
            repo: 'psp-data-viewer',
            job_id: job.data.jobs[0].id,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });
          console.log(req.data);
          // const dat = (req.data as string).split("\n").filter((val) => val.includes("dv-log:::"));
          setGithubMessages(req.data as string);

        }

      }
      else {
        addStartingMessage("Reading existing runner...");
        const req = await octokit.request('GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs', {
          owner: 'rajanphadnis',
          repo: 'psp-data-viewer',
          job_id: gitHubJobID()!,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        setGithubMessages(req.data as string);
      }
    }
  });

  createEffect(() => {
    if (createFirebase() == ProvisioningStatus.SUCCEEDED) {
      setCreateAzure(ProvisioningStatus.DEPLOYING);
    }
  });

  createEffect(() => {
    if (createAzure() == ProvisioningStatus.SUCCEEDED) {
      setCreateSite(ProvisioningStatus.DEPLOYING);
    }
  });

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
        <h1 class="text-xl font-bold mb-12">Deploying and Provisioning Instance:</h1>
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
