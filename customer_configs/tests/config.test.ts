import { glob } from "glob";
import YamlValidator from "yaml-validator";
import { structure } from "./structure";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

const options = {
  log: false,
  structure: structure,
  onWarning: null,
  writeJson: false,
};

const files: string[] = await glob([`./**.yml`]);

describe.each(files)(`Verifying YAML Configs'`, (file) => {
  test(`${file} isValidYAML`, () => {
    const validator = new YamlValidator(options);
    validator.checkFile(file);
    validator.report();
    console.log(validator.logs);
    expect(validator.inValidFilesCount).toBe(0);
  });

  test(`${file} has a valid data structure`, () => {
    const validator = new YamlValidator(options);
    validator.checkFile(file);
    validator.report();
    console.log(validator.logs);
    expect(validator.nonValidPaths.length).toBe(0);
  });
});
