import * as fs from "fs";
import { glob } from "glob";
import instance_config from "../instance_config.json";

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
          console.log(`Replaced ${searchString} in file ${filePath}`);
        }
      });
    }
  });
};

// Get all files in the folder
glob(
  [
    `./.firebaserc`,
    `./README.md`,
    `./build_tools/**.*`,
    `./webapp/src/**/**.*`,
    `./admin/src/**/**.*`,
    `./functions/*.py`,
    `./azure_functions/*.py`,
    `./docs/docs/**/**.*`,
    `./docs/src/**/**.*`,
    `./docs/*.ts`,
  ],
  {
    ignore: [`./build_tools/instance_config.ts`, `./instance_config.json`],
  }
).then((files) => {
  files.forEach((file) => {
    Object.keys(instance_config).forEach((element) => {
      replaceInFile(file, element, instance_config[element]);
    });
  });
});
