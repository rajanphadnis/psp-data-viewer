import { httpsCallable } from "firebase/functions";
import type { NewTestConfig } from "../types";
import { getBasicTestInfo, liveUpdate } from "./web-components";
import { ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export function new_gdrive_links(config: NewTestConfig) {
  const [inputtedID, inputtedName, inputtedGSEElement, inputtedTestElement] = getBasicTestInfo(config);
  const inputtedLinks: string[] = [];
  for (let i = 0; i < document.getElementsByClassName("url_list_div").length; i++) {
    const inputtedLinkVal = (document.getElementById(`url_list_div_textinput_${i}`)! as HTMLInputElement).value;
    if (inputtedLinkVal != "") {
      inputtedLinks.push(inputtedLinkVal);
    }
  }
  const createLinkTest = httpsCallable(globalThis.functions, "createTest_links_gdrive");
  const fxnPayload = {
    test_name: inputtedName,
    test_id: inputtedID,
    test_article: inputtedTestElement,
    gse_article: inputtedGSEElement,
    links: inputtedLinks,
    tdms_timeSyncDelay_ms: 8327,
  };
  console.log(fxnPayload);
  const currentStatusText = document.getElementById("newTest_currentStatus")! as HTMLDivElement;
  const nextStatusText = document.getElementById("newTest_nextStatus")! as HTMLDivElement;
  const currentStatusBar = document.getElementById("newTest_statusBar")! as HTMLDivElement;
  currentStatusText.innerHTML = "Requested new test";
  nextStatusText.innerHTML = "Fetching files from Google Drive...";
  currentStatusBar.innerHTML = "Step 1 of 6";
  liveUpdate(inputtedID);
  createLinkTest(fxnPayload).then((result) => {
    console.log(result);
  });
}

export function new_upload_tdsm_csv(config: NewTestConfig) {
  const currentStatusText = document.getElementById("newTest_currentStatus")! as HTMLDivElement;
  const nextStatusText = document.getElementById("newTest_nextStatus")! as HTMLDivElement;
  const currentStatusBar = document.getElementById("newTest_statusBar")! as HTMLDivElement;
  const finalizeButton = document.getElementById("finalizeButton")! as HTMLButtonElement;
  const [inputtedID, inputtedName, inputtedGSEElement, inputtedTestElement, inputtedDelay, checks] = getBasicTestInfo(config);
  if (!checks) {
    throw new Error("Input checks failed");
  }
  finalizeButton.style.display = "none";
  currentStatusText.innerHTML = "Starting file upload...";
  nextStatusText.innerHTML = "Do not close this window while you can still read this message";
  currentStatusBar.innerHTML = "Step 1 of 6";
  const inputtedFiles = [];
  const completedUpload: string[] = [];
  const completionStatus: string[] = [];
  for (let i = 0; i < document.getElementsByClassName("file_list_div").length; i++) {
    const inputtedFileVal = document.getElementById(`file_list_div_fileinput_${i}`)! as HTMLInputElement;
    if (inputtedFileVal.files) {
      inputtedFiles.push(inputtedFileVal.files![0]);
    }
  }
  console.log(inputtedFiles);
  for (let i = 0; i < inputtedFiles.length; i++) {
    const inputtedFile = inputtedFiles[i];
    const storageRef = ref(globalThis.storage, `${inputtedID}/raw-files/` + inputtedFile.name);
    const uploadTask = uploadBytesResumable(storageRef, inputtedFile);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const progressBar = document.getElementById("file_upload_progress_" + i)! as HTMLProgressElement;
        const progressStatus = document.getElementById("file_progress_p_" + i)! as HTMLParagraphElement;
        // progressBar.max = snapshot.totalBytes;
        progressBar.value = snapshot.bytesTransferred / snapshot.totalBytes;
        progressStatus.innerHTML = `${((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(2)}%`;
        // console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.info("Upload is paused");
            break;
          case "running":
            // console.log("Upload is running");
            console.info("Upload is running");
            completionStatus[i] = "running";
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        completedUpload.push(inputtedFile.name);
        completionStatus[i] = "completed";
        if (completedUpload.length == inputtedFiles.length) {
          // delay: 8327
          finalizeFileUpload(completedUpload, inputtedID, inputtedName, inputtedGSEElement, inputtedTestElement, inputtedDelay);
        } else {
          console.log("mismatched upload list size");
        }
      }
    );
  }

  // while (!(completionStatus.every((val, i, arr) => val === arr[0]) && completionStatus[0] === "completed")) {
  //   console.log("waiting for upload completion: " + completionStatus.toString());
  // }
}

function finalizeFileUpload(
  completedUpload: string[],
  inputtedID: string,
  inputtedName: string,
  inputtedGSEElement: string,
  inputtedTestElement: string,
  tdms_timeSyncDelay_ms: number
) {
  console.log("writing database results");
  const currentStatusText = document.getElementById("newTest_currentStatus")! as HTMLDivElement;
  const nextStatusText = document.getElementById("newTest_nextStatus")! as HTMLDivElement;
  const currentStatusBar = document.getElementById("newTest_statusBar")! as HTMLDivElement;
  currentStatusText.innerHTML = "Files Uploaded!";
  nextStatusText.innerHTML = "Preparing TDMS and CSV files...";
  currentStatusBar.innerHTML = "Step 2 of 6";
  liveUpdate(inputtedID);
  const firestore_payload = {
    id: inputtedID,
    name: inputtedName,
    gse_article: inputtedGSEElement,
    test_article: inputtedTestElement,
    creation_status: "File upload complete",
    creation_status_next_step: "Preparing database parsing...",
    creation_status_max_steps: 6,
    creation_status_current: 2,
    file_names: completedUpload,
    tdms_timeSyncDelay_ms: tdms_timeSyncDelay_ms,
  };
  const docRef = doc(db, `${inputtedID}/test_creation`);
  setDoc(docRef, firestore_payload, { merge: true });
}
