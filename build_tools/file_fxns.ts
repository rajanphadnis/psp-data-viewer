import fs from "fs";
import readline from "readline";
import { ChangeType } from "./types";

export async function getCurrentChangelogVersion(): Promise<string> {
  const fileStream = fs.createReadStream("CHANGELOG.md");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    rl.close(); // Close the readline interface after reading the first line
    return line.slice(4);
  }

  throw new Error("File is empty");
}

export function writeChangelog(contents: string) {
  // Read the existing content
  const existingContent = fs.readFileSync("CHANGELOG.md");

  // Prepend the new lines
  const updatedContent = contents + existingContent;

  // Write the updated content back to the file
  fs.writeFileSync("CHANGELOG.md", updatedContent);
}

export function writeNewPackageVersion(app_name: string, newVersion: string) {
  const file = require(`../${app_name}/package.json`);
  file.version = newVersion;
  fs.writeFileSync(`${app_name}/package.json`, JSON.stringify(file, null, 4));
}

export function generateChangelog(version: string, increment_type: ChangeType): string {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const headline = rl.question("Input header") ?? "bug fixes";
    const toReturn = `## v${version}\n${headline}\n\n### Changed\n- bug fixes\n\n`;
    return toReturn;
}