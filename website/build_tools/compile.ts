import { writeFileSync } from "fs";
import { join } from "path";
import { $ } from "bun";
import package_json from "../package.json";

function syncWriteFile(filename: string, data: any) {
  writeFileSync(join(__dirname, filename), data, {
    flag: "w",
  });
}

function dateTimeStringGen(): string {
  const currentdate = new Date();
  const monthLookup = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const datetimeString =
    monthLookup[currentdate.getMonth()] +
    " " +
    currentdate.getDate().toString().padStart(2, "0") +
    ", " +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours().toString().padStart(2, "0") +
    ":" +
    currentdate.getMinutes().toString().padStart(2, "0") +
    ":" +
    currentdate.getSeconds().toString().padStart(2, "0") +
    " UTC-" +
    (currentdate.getTimezoneOffset() / 60).toString();
  return datetimeString;
}

const appKey = Bun.env.APP_CHECK_KEY;
const stripe_key = Bun.env.STRIPE_PK;
const githubKey = Bun.env.GITHUB_WORKFLOW_KEY;
let toWrite: string | boolean;

if (appKey!.toString() == "false") {
  toWrite = false;
} else {
  toWrite = '"' + appKey + '"';
}

syncWriteFile(
  "../src/generated_app_info.ts",
  `export const appKey: string= '${toWrite}';\nexport const stripe_pk: string = '${stripe_key}';\nexport const githubKey: string = '${githubKey}';\nexport const appVersion: string = 'v${
    package_json.version
  }';\nexport const buildDate: string = '${dateTimeStringGen()}';\n`
);
await $`bun run build`;
console.log("Wrote env var file");
