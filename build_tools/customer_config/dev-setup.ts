import fs from "fs";

const webapp_prod_string = "psp-portfolio-f1205";
const webapp_dev_string = "psp-data-viewer-dev";

const admin_prod_string = "psp-admin-portfolio";
const admin_dev_string = "psp-admin-dev";

fs.readFile(".firebaserc", "utf-8", (err, data) => {
  if (err) throw err;

  let result = data;

  // Split the content by the target string
  let parts = data.split(webapp_prod_string);

  // Check if there are at least three occurrences
  if (parts.length > 3) {
    // Rejoin the parts, replacing the third occurrence
    result = parts.slice(0, 3).join(webapp_prod_string) + webapp_dev_string + parts.slice(3).join(webapp_prod_string);
    console.log("switched to webapp dev string");
  } else {
    console.log("Less than three occurrences found of webapp dev string. Not switching to webapp dev string.");
  }

  // Set admin dev string
  if (result.split(admin_prod_string).length > 1) {
    try {
      result = result.replace(admin_prod_string, admin_dev_string);
      console.log("switch the admin dev string");
      // Write the result back to the file
    } catch (error) {
      console.error(error);
      console.log("Admin dev string already exists");
    }
  } else {
    console.log("No occurences found of admin dev string");
  }

  //   Actually write changes to file
  fs.writeFile(".firebaserc", result, "utf-8", (err) => {
    if (err) throw err;
    console.log("Completed file operation");
  });
});
