import { writeFileSync } from "fs";
import { join } from "path";

function syncWriteFile(filename: string, data: any) {
  writeFileSync(join(__dirname, filename), data, {
    flag: "w",
  });
}

const appKey = Bun.env.APP_CHECK_KEY;
let toWrite: string | boolean;

if((appKey!).toString() == "false") {
  toWrite = false;
}
else {
  toWrite = '"' + appKey + '"';
}


syncWriteFile(
  "../src/generated_app_check_secret.ts",
  'export const appCheckSecret: string | boolean = ' + toWrite + ';'
);
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./built",
  minify: true, // default false
});
console.log("Wrote env var, built, and minified");

