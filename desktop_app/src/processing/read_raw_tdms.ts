import { invoke } from "@tauri-apps/api/core";

export async function readRawData(
  filePath: string
): Promise<{ bit_mask: string; tdms_version: string; name: string | undefined }> {
  const thing = new Promise<{ bit_mask: string; tdms_version: string; name: string | undefined }>((res, rej) => {
    const fetchData: Promise<{ [prop: string]: string }> = invoke("get_tdms_name", { path_string: filePath });
    fetchData
      .then((rawData) => {
        console.log(rawData);
        console.log(rawData["name"]);
        let name = undefined;
        if (Object.keys(rawData).includes("name")) {
          name = rawData["name"];
        }
        console.log(rawData["TDMS_BIT_MASK"]);
        console.log(rawData["TDMS_VERSION"]);
        res({ bit_mask: rawData["TDMS_BIT_MASK"], tdms_version: rawData["TDMS_VERSION"], name: name });
      })
      .catch((errors: string) => {
        console.log(errors);
        rej();
      });
  });
  return thing;
}
