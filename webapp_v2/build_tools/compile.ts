import { writeFileSync, readFileSync } from "fs";
import { join } from "path";
import { $ } from "bun";
import package_json from "../package.json";
import minimist from "minimist";
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

const config_file: string = minimist(process.argv.slice(2))["_"][0] ?? "dev.yml";
const appKey = Bun.env.APP_CHECK_KEY;
let toWrite: string | boolean;

if (appKey!.toString() == "false") {
  toWrite = false;
} else {
  toWrite = '"' + appKey + '"';
}

const indexCSS = readFileSync("./src/index.css", "utf-8");
const doc = yaml.load(readFileSync(`../customer_configs/${config_file}`, "utf8"), { json: true }) as any;

syncWriteFile(
  "../src/generated_app_info.ts",
  `export const appCheckSecret: string | boolean = ${toWrite};\nexport const appVersion: string = 'v${
    package_json.version
  }';\nexport const buildDate: string = '${dateTimeStringGen()}';\nexport const config = ${JSON.stringify(
    doc
  ).toString()}`
);
syncWriteFile(
  "../src/index.css",
  `@import "tailwindcss";\n\n:root {
  --rush: ${doc.colors.primary_dark};
  --aged: ${doc.colors.accent};
  --field: ${doc.colors.primary};
  --cool-gray: ${doc.colors.background_light};
  --background-color: ${doc.colors.background};
}\n\n${indexCSS.substring(indexCSS.indexOf("html,"), indexCSS.length)}`
);
syncWriteFile(
  "../../.firebaserc",
  `{
  "projects": {
    "default": "${doc.firebase.projectId}"
  },
  "targets": {
    "${doc.firebase.projectId}": {
      "hosting": {
        "webapp": [
          "${doc.firebase.webapp_site}"
        ],
        "admin": [
          "dataviewer-admin"
        ],
        "docs": [
          "dataviewer-docs"
        ],
        "website": [
          "dataviewer-space"
        ]
      }
    }
  },
  "etags": {}
}
`
);
// await Bun.build({
//   entrypoints: ["./src/index.ts"],
//   outdir: "./built",
//   minify: false, // default false
// });
await $`bun run build`;
console.log("Wrote env var file");
