import minimist from "minimist";
import { exit } from "process";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
    const customerID = data["customerID"];
    console.log(`dv-log:::slug: ${slug}`);
    console.log(`dv-log:::name: ${name}`);
    console.log(`dv-log:::short_name: ${short_name}`);
    console.log(`dv-log:::country: ${country}`);
    console.log(`dv-log:::zipCode: ${zipCode}`);
    console.log(`dv-log:::email: ${email}`);
    console.log(`dv-log:::customer ID: ${customerID}`);

    console.log("Creating database and hosting site...");
    const dbSetup = await fetch(`https://createnewdatabase-apichvaima-uc.a.run.app/?slug=${slug}&cusid=${customerID}`, {
      method: "GET",
    });
    console.log("dbSetup:");
    console.log(dbSetup);
    console.log("Creating Stripe and other Firebase resources...");
    const stripeResources = await fetch("https://createstripeandfirebaseresources-apichvaima-uc.a.run.app", {
      method: "POST",
      body: JSON.stringify({ slug: slug, name: name, customerID: customerID, zipCode: zipCode, email: email }),
      headers: { "Content-Type": "application/json" },
    });
    console.log("Stripe Resources:");
    console.log(stripeResources);
    console.log("dv-log:::firebase-complete");
  }
}

main(docID);
