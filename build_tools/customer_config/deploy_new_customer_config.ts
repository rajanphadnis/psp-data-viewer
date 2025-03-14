import minimist from "minimist";
import { writeFileSync } from "fs";
import { dump } from "js-yaml";
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

    const dataYAML = {
      azure: {
        function_app_name: `dataviewer-api-${slug}`,
        resource_group: `dataviewerrg${slug}`,
        storage_account: `dataviewerstor${slug}`,
        share_name: `dataviewer-fileshare-${slug}`,
      },
      colors: {
        accent: "#8e6f3e",
        background: "#1D1D1D",
        background_light: "#6f727b",
        primary: "#ddb945",
        primary_dark: "#daaa00",
      },
      firebase: {
        apiKey: "AIzaSyDzZWBXQ5L9N92GRNUNGMse8AeUvbwFFyI",
        appId: "1:267504321387:web:3c5b9c2a1ec15ff452822e",
        app_check_provider_token: "",
        authDomain: "dataviewer-space.firebaseapp.com",
        measurementId: "G-WRP7BXPKHK",
        messagingSenderId: "267504321387",
        projectId: "dataviewer-space",
        storageBucket: "dataviewer-space.firebasestorage.app",
        webapp_site: `dataviewer-${slug}`,
        databaseID: `${slug}-firestore`,
      },
      naming: {
        name_long: `${name} Dataviewer`,
        name_short: `${short_name} Dataviewer`,
        page_title: short_name,
        slug: slug,
      },
      urls: {
        admin_dashboard_url: `https://admin.dataviewer.space/${slug}`,
        api_base_url: `https://dataviewer-api-${slug}.azurewebsites.net`,
        docs_url: "https://docs.dataviewer.space",
        github_url: "https://github.com/rajanphadnis/psp-data-viewer",
      },
      stripe: {
        customerID: customerID,
      },
    };
    const yamlString = "---\n" + dump(dataYAML);
    writeFileSync(`./customer_configs/${slug}.yml`, yamlString);
    console.log("dv-log:::deploy-complete");
  }
}

main(docID);
