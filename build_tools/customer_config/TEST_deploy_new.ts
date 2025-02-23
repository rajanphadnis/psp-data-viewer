import minimist from "minimist";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { exit } from "process";
import { setTimeout } from "timers/promises";

const docID: string = minimist(process.argv.slice(2))["_"][0] ?? "";

if (docID == "") {
  console.log("dv-log:::Missing document ID");
  exit(1);
}

async function main(docID: string) {
  console.log(`id: "${docID}"`);
  const serviceAccount = require("../GoogleCloudSA_GitHubAccess.json");
  initializeApp({
    credential: cert(serviceAccount),
  });

  const db = getFirestore();

  const cityRef = db.collection("temp_accounts").doc(docID);
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log("dv-log:::Couldn't find temporary account info!");
    exit(1);
  } else {
    console.log("dv-log:::Reading Account Info...");
    console.log("Document data:", doc.data());
    const data = doc.data()!;
    const slug = data["slug"];
    const name = data["orgName"];
    const short_name = data["orgNameShort"];
    const country = "US";
    const zipCode = data["zipCode"];
    const email = data["email"];
    console.log(`dv-log:::Slug: ${slug}`);
    console.log(`dv-log:::name: ${name}`);
    console.log(`dv-log:::short_name: ${short_name}`);
    console.log(`dv-log:::country: ${country}`);
    console.log(`dv-log:::zipCode: ${zipCode}`);
    console.log(`dv-log:::email: ${email}`);

    // switch (stepToRun) {
    //   case 1:
    //     setTimeout()
    //     break;

    //   default:
    //     break;
    // }

    await setTimeout(10000);
    console.log("dv-log:::firebase-complete");
    await setTimeout(10000);
    console.log("dv-log:::azure-complete");
    await setTimeout(10000);
    console.log("dv-log:::deploy-complete");
  }
}

main(docID);
