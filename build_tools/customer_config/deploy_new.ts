async function main() {
  const slug = "tamu";
  const name = "Texas A&M REDS";
  const country = "US";
  const zipCode = "92069";
  const email = "rajansd28@gmail.com";

  // const response = await fetch("https://createstripeandfirebaseresources-apichvaima-uc.a.run.app", {
  //   method: "POST",
  //   body: JSON.stringify({ slug: slug, name: name, country: country, zipCode: zipCode, email: email }),
  //   headers: { "Content-Type": "application/json" },
  // });

  const response = await fetch("https://createazureresources-apichvaima-uc.a.run.app?slug=pspl", {
    method: "GET",
    // body: JSON.stringify({ slug: slug, name: name, country: country, zipCode: zipCode, email: email }),
    // headers: { "Content-Type": "application/json" },
  });

  console.log(await response.json());
}

main();
