import fs from "fs";
import archiver from "archiver";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

var output = fs.createWriteStream("az-compiled.zip");
var archive = archiver("zip");

output.on("close", function () {
  console.log(archive.pointer() + " total bytes");
  console.log("archiver has been finalized and the output file descriptor has closed.");
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);
archive.file("azure_functions/function_app.py", { name: "function_app.py" });
archive.file("azure_functions/host.json", { name: "host.json" });
archive.file("azure_functions/requirements.txt", { name: "requirements.txt" });
archive.finalize();

// const app = initializeApp({
//   storageBucket: "dataviewer-space.firebasestorage.app",
// });

// const bucket = getStorage().bucket();

// const uploadStatus = await bucket.upload("./az-compiled.zip");

// console.log(uploadStatus);
