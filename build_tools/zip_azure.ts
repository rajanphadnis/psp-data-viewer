import fs from "fs";
import archiver from "archiver";

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

// append files from a sub-directory, putting its contents at the root of archive
archive.file("azure_functions/function_app.py", { name: "function_app.py" });
archive.file("azure_functions/host.json", { name: "host.json" });
archive.file("azure_functions/requirements.txt", { name: "requirements.txt" });
// archive.directory("azure_functions/", false);

// append files from a sub-directory and naming it `new-subdir` within the archive
// archive.directory("subdir/", "new-subdir");

archive.finalize();
