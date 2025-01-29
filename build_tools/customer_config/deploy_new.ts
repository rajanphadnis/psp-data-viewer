import { writeFileSync } from "fs";
import { dump } from "js-yaml";
import { createInterface } from "readline/promises";

async function main() {
  const slug = "tamu";
  const name = "Texas A&M REDS";
  const short_name = "REDS";
  const country = "US";
  const zipCode = "92069";
  const email = "rajansd28@gmail.com";

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(`Initialize for ${name}(${slug}) [y/n] `);
  if (answer == "y") {
    const dbSetup = await fetch(`https://createnewdatabase-apichvaima-uc.a.run.app/?slug=${slug}`, {
      method: "GET",
    });
    console.log(await dbSetup.json());

    const stripeResources = await fetch("https://createstripeandfirebaseresources-apichvaima-uc.a.run.app", {
      method: "POST",
      body: JSON.stringify({ slug: slug, name: name, country: country, zipCode: zipCode, email: email }),
      headers: { "Content-Type": "application/json" },
    });
    const stripeResult = await stripeResources.json();
    const customerID = stripeResult["result"]["customer"];
    console.log(stripeResult);
    console.log(customerID);

    const azureResources = await fetch(`https://createazureresources-apichvaima-uc.a.run.app?slug=${slug}`, {
      method: "GET",
    });
    const azureResponse = await azureResources.json();
    console.log(azureResponse);
    // need to extract api url from here

    const data = {
      azure: {
        function_app_name: `dataviewer-serverless-function-${slug}`,
        resource_group: `dataviewer-rg-${slug}`,
        storage_account: `dataviewerstorage${slug}`,
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
        admin_dashboard_url: "https://admin.dataviewer.space",
        api_base_url: "https://psp-api.rajanphadnis.com", // to update
        docs_url: "https://docs.dataviewer.space",
        github_url: "https://github.com/rajanphadnis/psp-data-viewer",
        update_test_metadata_url: "https://updatetestmetadata-w547ikcrwa-uc.a.run.app", //need to update?
      },
      stripe: {
        customerID: customerID,
      },
    };

    const yamlString = "---\n" + dump(data);
    writeFileSync(`./customer_configs/${slug}.yml`, yamlString);
  } else {
    console.log("Exiting...");
  }
}

main();
