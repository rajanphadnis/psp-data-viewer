import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { $ } from "bun";
import package_json from "../package.json";
import yaml from "js-yaml";

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

let reserved_slugs: string[] = [];

readdirSync("../customer_configs/").forEach((file) => {
  if (file.endsWith(".yml")) {
    console.log(file);
    const doc = yaml.load(readFileSync(`../customer_configs/${file}`, "utf8"), { json: true }) as any;
    const slug = doc["naming"]["slug"] as string;
    reserved_slugs.push(slug);
    console.log(doc["naming"]["slug"]);
  }
});

syncWriteFile(
  "../src/generated_app_info.ts",
  `export const appKey: string = ${toWrite};\nexport const stripe_pk: string = '${stripe_key}';\nexport const githubKey: string = '${githubKey}';\nexport const appVersion: string = 'v${
    package_json.version
  }';\nexport const buildDate: string = '${dateTimeStringGen()}';\nexport const reservedSlugs: string[] = ['${reserved_slugs.join(
    "', '"
  )}'];\n`
);
await $`bun run build`;
console.log("Wrote env var file");
