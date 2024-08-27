import { getTestArticles } from "../db_interaction";
import { updateStatus, updateTestCreateStatus } from "../status";
import { loadingStatus, type NewTestConfig } from "../types";
import { initConfirmationModal } from "./modal";
import { generateConfigPathEntries } from "./web-components";

declare global {
  var configs: NewTestConfig[];
}

export async function newTest() {
  await getTestArticles();
  generateTestConfigs();
  generateConfigPathEntries();
  initConfirmationModal();
  updateTestCreateStatus(loadingStatus.DONE);
  return null;
}

function generateTestConfigs() {
  const newConfigs: NewTestConfig[] = [
  //   {
  //   name: "TDMS & CSV",
  //   id: "gdrive_tdms_csv",
  //   create_type: "Google Drive Links",
  //   upload_urls: [],
  // },{
  //   name: "HDF5",
  //   id: "gdrive_hdf5",
  //   create_type: "Google Drive Links",
  //   upload_urls: [],
  // },
  {
    name: "TDMS & CSV",
    id: "upload_tdms_csv",
    create_type: "File Upload",
    upload_urls: [],
  },{
    name: "HDF5",
    id: "upload_hdf5",
    create_type: "File Upload",
    upload_urls: [],
  }];
  globalThis.configs = newConfigs;
}


