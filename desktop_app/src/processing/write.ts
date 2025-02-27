import { invoke } from "@tauri-apps/api/core";
import { Setter } from "solid-js";
import { ExportChannel } from "../types";

export async function writeHDF5(data: {}, setErrorMsg: Setter<string>) {
  // let toWrite = {};
  // data.forEach((dat) => {
  //   (toWrite as any)[`${dat.channel_name}`] = dat.data;
  // });
  console.log(data);
  const writeHDF5: Promise<boolean | string> = invoke("create_hdf5", { export_data: data });
  writeHDF5
    .then(() => {
      console.log("complete");
    })
    .catch((error) => {
      setErrorMsg(error);
    });
}
