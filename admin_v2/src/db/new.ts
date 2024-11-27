import { Accessor, Setter } from "solid-js";
import { ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export function new_upload_tdsm_csv(
  setStatus: Setter<string[]>,
  files: File[],
  id: string,
  setUploadPercent: Setter<number[]>,
  name: string,
  gse: string,
  testArticle: string,
  tdmsDelay: number
) {
  const checks = true;
  if (!checks) {
    throw new Error("Input checks failed");
  }
  setStatus(["Starting file upload...", "Uploading TDMS+CSV Files", "1", "6"]);
  const completedUpload: string[] = [];
  const completionStatus: string[] = [];
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    const inputtedFile = files[i];
    const storageRef = ref(globalThis.storage, `${id}/raw-files/` + inputtedFile.name);
    const uploadTask = uploadBytesResumable(storageRef, inputtedFile);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setUploadPercent((prev) => {
          const newlist = [...prev];
          newlist[i] = snapshot.bytesTransferred / snapshot.totalBytes;
          return [...newlist];
        });
        switch (snapshot.state) {
          case "paused":
            console.info("Upload is paused");
            break;
          case "running":
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
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      async () => {
        completedUpload.push(inputtedFile.name);
        completionStatus[i] = "completed";
        if (completedUpload.length == files.length) {
          const firestore_payload = {
            id: id,
            name: name,
            gse_article: gse,
            test_article: testArticle,
            creation_status: "File upload complete",
            creation_status_next_step: "Preparing database parsing...",
            creation_status_max_steps: 6,
            creation_status_current: 2,
            file_names: completedUpload,
            tdms_timeSyncDelay_ms: tdmsDelay,
          };
          const docRef = doc(db, `${id}/test_creation`);
          await setDoc(docRef, firestore_payload, { merge: true });
        } else {
          console.log("mismatched upload list size");
        }
      }
    );
  }
}

export function new_upload_hdf5(
  setStatus: Setter<string[]>,
  files: File[],
  id: string,
  setUploadPercent: Setter<number[]>,
  name: string,
  gse: string,
  testArticle: string
) {
  const checks = true;
  if (!checks) {
    throw new Error("Input checks failed");
  }
  setStatus(["Starting file upload...", "Uploading HDF5 File", "1", "6"]);
  const completedUpload: string[] = [];
  const completionStatus: string[] = [];
  console.log(files);
  const inputtedFile = files[0];
  const storageRef = ref(globalThis.storage, `${id}/raw-files/${id}.hdf5`);
  const uploadTask = uploadBytesResumable(storageRef, inputtedFile);
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      setUploadPercent((prev) => {
        const newlist = [...prev];
        newlist[0] = snapshot.bytesTransferred / snapshot.totalBytes;
        return [...newlist];
      });
      switch (snapshot.state) {
        case "paused":
          console.info("Upload is paused");
          break;
        case "running":
          console.info("Upload is running");
          completionStatus[0] = "running";
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
        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      completedUpload.push(inputtedFile.name);
      completionStatus[0] = "completed";
      console.log("writing database results");
      setStatus(["File Uploaded!", "Preparing HDF5 files...", "2", "6"]);
      const firestore_payload = {
        id: id,
        name: name,
        gse_article: gse,
        test_article: testArticle,
        creation_status: "HDF5 Upload Finished",
        creation_status_next_step: "Uploading database...",
        creation_status_max_steps: 6,
        creation_status_current: 4,
        file_names: completedUpload,
        tdms_timeSyncDelay_ms: 0,
      };
      const docRef = doc(db, `${id}/test_creation`);
      setDoc(docRef, firestore_payload, { merge: true });
      const firestore_payload2 = {
        id: id,
        name: name,
        gse_article: gse,
        test_article: testArticle,
      };
      const docRef2 = doc(db, `${id}/ready_to_deploy`);
      setDoc(docRef2, firestore_payload2, { merge: true });
    }
  );
}
