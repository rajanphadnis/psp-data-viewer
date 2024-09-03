import { generateChangelog, getCurrentChangelogVersion, writeChangelog, writeNewPackageVersion } from "./file_fxns";
import { ChangeType } from "./types";
import minimist from "minimist";
import { exec } from "child_process";
import open from "open";

const patchType_cmdline: string = minimist(process.argv.slice(2))["_"][0] ?? "patch";
const app_names: string[] = ["admin", "docs", "webapp"];
let changeType = ChangeType.PATCH;

switch (patchType_cmdline.toString().toLowerCase()) {
  case "patch":
    changeType = ChangeType.PATCH;
    break;
  case "minor":
    changeType = ChangeType.MINOR;
    break;
  case "major":
    changeType = ChangeType.MAJOR;
    break;

  default:
    changeType = ChangeType.PATCH;
    break;
}

getCurrentChangelogVersion()
  .then(async (changelog_version) => {
    const package_versions: string[] = app_names.map((app_name) => {
      return require(`../${app_name}/package.json`).version;
    });
    const all_versions = [...package_versions, changelog_version];
    const package_versions_identical: boolean = package_versions.every((val, i, arr) => val === arr[0]);
    const all_versions_identical: boolean = all_versions.every((val, i, arr) => val === arr[0]);

    if (all_versions_identical) {
      console.log("all versions identical");
      app_names.forEach((app_name) => {
        const current_version: string = require(`../${app_name}/package.json`).version;
        const newVersion = incrementVersion(current_version, changeType);
        writeNewPackageVersion(app_name, newVersion);
      });
      const newVersion = incrementVersion(changelog_version, changeType);
      const newChangelog = await generateChangelog(newVersion, changeType);
      writeChangelog(newChangelog);
      console.log("files updated successfully");
      if (changeType == ChangeType.PATCH) {
        const response = await new Promise<void>(async (resolve, reject) => {
          exec(
            `git add . && git commit -m "bug fixes and bump to v${newVersion}" && git push origin main`,
            (err, stdout, stderr) => {
              // your callback
              console.log(stdout);
              resolve();
            }
          );
        });
        console.log(
          `Click to start release process: https://github.com/rajanphadnis/psp-data-viewer/releases/new?tag=v${newVersion}`
        );
        open(`https://github.com/rajanphadnis/psp-data-viewer/releases/new?tag=v${newVersion}`);
      } else {
        console.log(
          `Once you've updated the changelog and pushed to git, click to start release process: https://github.com/rajanphadnis/psp-data-viewer/releases/new?tag=v${newVersion}`
        );
      }
    } else if (package_versions_identical) {
      console.error("Changelog version doesn't match package.json versions!");
    } else {
      console.error("Mismatched package.json versions!");
    }
  })
  .catch((err) => console.error("Error:", err));

function incrementVersion(current_version: string, increment_type: ChangeType) {
  let major_version: number = parseInt(current_version.split(".")[0]);
  let minor_version: number = parseInt(current_version.split(".")[1]);
  let patch_version: number = parseInt(current_version.split(".")[2]);

  if (increment_type == ChangeType.MAJOR) {
    major_version = major_version + 1;
  }
  if (increment_type == ChangeType.MINOR) {
    minor_version = minor_version + 1;
  }
  if (increment_type == ChangeType.PATCH) {
    patch_version = patch_version + 1;
  }
  const newVersionNum = `${major_version}.${minor_version}.${patch_version}`;
  return newVersionNum;
}
