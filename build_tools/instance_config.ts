import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

const folderPath = "./build_tools"; // Replace with your folder path
// const searchString = 'oldString'; // Replace with the string you want to replace
// const replaceString = 'newString'; // Replace with the new string

// Function to replace string in a file
const replaceInFile = (filePath: string, searchString: string, replaceString: string) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    if (data.split(searchString).length > 1) {
      const result = data.replace(new RegExp(searchString, "g"), replaceString);

      fs.writeFile(filePath, result, "utf8", (err) => {
        if (err) {
          console.error(`Error writing file ${filePath}:`, err);
        } else {
          console.log(`Replaced in file ${filePath}`);
        }
      });
    }
  });
};

// Get all files in the folder
glob(`./*.*`, { ignore: [`./build_tools/instance_config.ts`,`./instance_config.json`] }).then((files) => {
  //   if (err) {
  //     console.error("Error finding files:", err);
  //     return;
  //   }
  console.log(files);

  files.forEach((file) => {
    replaceInFile(file, "____firebase_config_webapp_prod_string____", "psp-portfolio-f1205");
  });
});
