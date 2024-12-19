import * as fs from "fs";
import { glob } from "glob";
import yaml from "js-yaml";
import YamlValidator from "yaml-validator";
import { structure } from "../../customer_configs/tests/structure";

const options = {
  log: false,
  structure: structure,
  onWarning: null,
  writeJson: false,
};

// Get all files in the folder
glob([`./customer_configs/**.yml`]).then((files) => {
  const validator = new YamlValidator(options);
  validator.validate(files);
  validator.report();
  console.log(validator.inValidFilesCount);

  // files.forEach((file) => {
  //   try {
  //     const doc = yaml.load(fs.readFileSync(file, "utf8"));
  //     console.log(doc);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   // console.log(file);
  //   // Object.keys(instance_config).forEach((element) => {
  //   //   replaceInFile(file, element, instance_config[element]);
  //   // });
  // });
});
