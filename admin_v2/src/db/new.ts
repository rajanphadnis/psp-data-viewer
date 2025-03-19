import { ShareServiceClient } from "@azure/storage-file-share";
import { httpsCallable } from "firebase/functions";
import { Setter } from "solid-js";
import { config } from "../generated_app_check_secret";

export async function new_upload(
  setStatus: Setter<string[]>,
  file: File,
  id: string,
  setUploadPercent: Setter<number>,
  name: string,
  gse: string,
  testArticle: string,
  slug: string,
) {
  const checks = true;
  if (!checks) {
    throw new Error("Input checks failed");
  }
  setStatus(["Authenticating Upload...", "Uploading HDF5 File", "0", "3"]);
  const genSAS = httpsCallable(globalThis.functions, "generate_sas_token");
  let sas: string | undefined = undefined;
  try {
    const sasResponse = await genSAS({ slug: slug, fileName: `${id}.hdf5` });
    console.log(sasResponse.data);
    sas = (sasResponse as any).data["sas_token"];
  } catch {
    console.error("Failed to get authentication token for file upload");
    setStatus([
      "Failed to authenticate",
      "Failed to get authentication token for file upload",
      "0",
      "3",
    ]);
  }
  if (sas) {
    const url = `https://${(config as any)[slug].azure.storage_account}.file.core.windows.net?${sas}`;
    const serviceClientWithSAS = new ShareServiceClient(url);
    setStatus(["Uploading file...", "Uploading HDF5 File", "1", "3"]);
    const directoryClient = serviceClientWithSAS
      .getShareClient((config as any)[slug].azure.share_name)
      .getDirectoryClient("hdf5_data");
    const file_size = file.size;
    console.log(file_size);
    const fileClient = directoryClient.getFileClient(`${id}.hdf5`);
    await fileClient.create(file_size);
    console.log(`Created file in Azure '${id}.hdf5' successfully`);
    await fileClient.uploadData(file, {
      onProgress: (progress) => {
        console.log((progress.loadedBytes / file_size) * 100);
        setUploadPercent(progress.loadedBytes / file_size);
      },
    });
    console.log(
      `Upload file range "${file_size}" to '${id}.hdf5' successfully`,
    );
  }
  console.log("writing database results");
  setStatus(["File Uploaded!", "Validating test...", "2", "3"]);
  const completeTest = httpsCallable(
    globalThis.functions,
    "create_new_dataset",
  );
  completeTest({
    gse_article: gse,
    test_id: id,
    test_name: name,
    test_article: testArticle,
    api_base_url: `${(config as any)[slug].urls.api_base_url}/api`,
    db_id: (config as any)[slug].firebase.databaseID,
    stripeID: (config as any)[slug].stripe.customerID,
  })
    .then((result) => {
      console.log(result);
      setStatus(["Test Validated!", "Complete!", "3", "3"]);
    })
    .catch((error) => {
      console.error(error);
    });
}
