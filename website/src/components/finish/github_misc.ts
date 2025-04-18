import { Octokit } from "@octokit/core";
import { githubKey } from "../../generated_app_info";
import { delay } from "../../misc";
import { doc, updateDoc } from "@firebase/firestore";
import { ProvisioningStatus } from "../../types";
import { Setter } from "solid-js";

export const octokit = new Octokit({
  auth: githubKey,
});

export async function getJobAndURL(docID: string, slug: string, customerID: string) {
  const randomUID = crypto.randomUUID();
  await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
    owner: "rajanphadnis",
    repo: "psp-data-viewer",
    workflow_id: "create_instance.yml",
    ref: "main",
    inputs: {
      docID: docID,
      id: randomUID,
      slug: slug,
      cusID: customerID,
    },
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  let jobID = 0;
  let count = 0;
  let html_url = "";
  let runID = 0;
  while (jobID == 0 && count < 5) {
    count += 1;
    await delay(2000);
    const send = await octokit.request("GET /repos/{owner}/{repo}/actions/runs", {
      owner: "rajanphadnis",
      repo: "psp-data-viewer",
      event: "workflow_dispatch",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const runs = send.data.workflow_runs.filter((run) => run.status != "completed");
    console.debug("filtered runs:");
    console.debug(runs);
    if (runs.length > 0) {
      runs.forEach(async (run) => {
        const job = await octokit.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", {
          owner: "rajanphadnis",
          repo: "psp-data-viewer",
          run_id: run.id,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const filteredJobs = job.data.jobs.filter((job) => job.steps != undefined && job.steps.length > 0);
        console.debug("filtered jobs:");
        console.debug(filteredJobs);
        filteredJobs.forEach((job) => {
          const stepNames = job.steps!.map((step) => step.name);
          if (stepNames.includes(randomUID)) {
            jobID = job.id;
            // html_url = job.html_url!;
            runID = job.run_id;
            return;
          }
        });
      });
    }
  }

  if (jobID == 0) {
    console.error("failed to find dispatch event");
    return;
  }
  if (html_url == "") {
    html_url = constructGithubHtmlURL(jobID, runID);
  }
  console.debug(jobID);
  const docRef = doc(globalThis.db, "temp_accounts", docID);
  await updateDoc(docRef, {
    github_jobID: jobID,
    github_html_url: html_url,
  });
  return {
    jobID: jobID,
    html_url: html_url,
  };
  // for (let i = 0; i < 20; i++) {
  //   console.debug(i);
  //   await delay(5000);
  //   const req = await octokit.request('GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs', {
  //     owner: 'rajanphadnis',
  //     repo: 'psp-data-viewer',
  //     job_id: jobID,
  //     headers: {
  //       'X-GitHub-Api-Version': '2022-11-28'
  //     }
  //   });
  //   console.debug(req.data);
  //   // const dat = (req.data as string).split("\n").filter((val) => val.includes("dv-log:::"));
  //   setGithubMessages(req.data as string);

  // }
}

export async function getHtmlURLFromExistingJob(jobID: number) {
  const job = await octokit.request("GET /repos/{owner}/{repo}/actions/jobs/{job_id}", {
    owner: "OWNER",
    repo: "REPO",
    job_id: jobID,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return constructGithubHtmlURL(job.data.id, job.data.run_id);
}

export function constructGithubHtmlURL(jobID: number, runID: number) {
  return `https://github.com/rajanphadnis/psp-data-viewer/actions/runs/${runID}`;
}

export async function listenForEventCompletion(
  jobID: number,
  firebaseCompletion: Setter<ProvisioningStatus>,
  azureCompletion: Setter<ProvisioningStatus>,
  deployCompletion: Setter<ProvisioningStatus>
) {
  // var totalJobStatus = "";
  const job = await octokit.request("GET /repos/{owner}/{repo}/actions/jobs/{job_id}", {
    owner: "rajanphadnis",
    repo: "psp-data-viewer",
    job_id: jobID,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const runId = job.data.run_id;
  let firebaseExit = false;
  let azureExit = false;
  let deployExit = false;
  while (!(firebaseExit && azureExit && deployExit)) {
    await delay(5000);
    const run = await octokit.request("GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs", {
      owner: "rajanphadnis",
      repo: "psp-data-viewer",
      run_id: runId,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const firebaseJob = run.data.jobs.filter((job) => job.name == "firebaseAndStripe")[0];
    const azureJob = run.data.jobs.filter((job) => job.name == "azure")[0];
    const deployJob = run.data.jobs.filter((job) => job.name == "finish")[0];
    if (firebaseJob != undefined) {
      if (firebaseJob.status == "completed" || firebaseJob.status == null) {
        firebaseExit = true;
        if (firebaseJob.conclusion == "success") {
          firebaseCompletion(ProvisioningStatus.SUCCEEDED);
        } else {
          firebaseCompletion(ProvisioningStatus.FAILED);
        }
      }
    }
    if (azureJob != undefined) {
      if (azureJob.status == "completed") {
        azureExit = true;
        if (azureJob.conclusion == "success") {
          azureCompletion(ProvisioningStatus.SUCCEEDED);
        } else {
          azureCompletion(ProvisioningStatus.FAILED);
        }
      }
    }
    if (deployJob != undefined) {
      if (deployJob.status == "completed") {
        deployExit = true;
        if (deployJob.conclusion == "success") {
          deployCompletion(ProvisioningStatus.SUCCEEDED);
        } else {
          deployCompletion(ProvisioningStatus.FAILED);
        }
      }
    }
    if (firebaseJob != undefined && azureJob != undefined && deployJob != undefined) {
      console.log(
        `Pinging for job status update. Current completion status:\nfirebase: ${firebaseJob.status}\nazure: ${azureJob.status}\ndeploy:${deployJob.status}`
      );
    } else {
      console.log(
        `Pinging for job status update. Current completion status:\nfirebase: ${firebaseJob}\nazure: ${azureJob}\ndeploy:${deployJob}`
      );
    }
  }
  console.debug("exited loop");
  return;
}
