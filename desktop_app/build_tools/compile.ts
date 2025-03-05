import { writeFileSync } from "fs";
import { join } from "path";
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

syncWriteFile(
  "../src/build_info.ts",
  `export const appVersion: string = 'v${
    package_json.version
  }';\nexport const buildDate: string = '${dateTimeStringGen()}';`
);
console.log("Wrote env var, built, and minified");
