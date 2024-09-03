import { writeFileSync } from "fs";
import { join } from "path";
const package_json = require("../package.json");

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
  currentdate.getSeconds().toString().padStart(2, "0") + " UTC-" + (currentdate.getTimezoneOffset()/60).toString();


syncWriteFile(
  "../src/generated_app_info.ts",
  "export const appCheckSecret: string | boolean = " +
    toWrite +
    `;\nexport const appVersion: string = 'v${package_json.version}';\nexport const buildDate: string = '${datetimeString}';`
);
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./built",
  minify: false, // default false
});
console.log("Wrote env var, built, and minified");
