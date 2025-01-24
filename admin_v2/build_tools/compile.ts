import { $ } from "bun";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

function syncWriteFile(filename: string, data: any) {
  writeFileSync(join(__dirname, filename), data, {
    flag: "w",
  });
}

const appKey = Bun.env.APP_CHECK_KEY;
let toWrite: string | boolean;

if (appKey!.toString() == "false") {
  toWrite = false;
} else {
  toWrite = '"' + appKey + '"';
}

let toWriteJSON: { [slug: string]: any } = {};

readdirSync("../customer_configs/").forEach((file) => {
  if (file.endsWith(".yml")) {
    console.log(file);
    const doc = yaml.load(readFileSync(`../customer_configs/${file}`, "utf8"), { json: true }) as any;
    const slug = doc["naming"]["slug"] as string;
    toWriteJSON[slug] = doc;
    console.log(doc["naming"]["slug"]);
  }
});

syncWriteFile(
  "../src/generated_app_check_secret.ts",
  `export const appCheckSecret: string | boolean = " + toWrite + ";\nexport const config = ${JSON.stringify(
    toWriteJSON
  ).toString()}`
);
await $`bun run build`;
console.log("Wrote env var, built, and minified");
