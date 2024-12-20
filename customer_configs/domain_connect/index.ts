export async function main() {
  get_customer();
}

const isProd = false;

const auth_thing = isProd
  ? "dLDFGsKkfpy6_2hrCSy8GiH2srNY4fBd9Ke:6P7RZKhBHoJZDDumQBg8m9"
  : "3mM44WkB27iM5S_RKuajmYGjHLvuWTEeMbdNB:D1G8jW3VpWq5v1fKHc8ERo";

const uuid = "959b3bb1-3b97-48ed-bf6b-f7db6bd95cc5";

async function add_record() {
  const response = await fetch("https://api.ote-godaddy.com/v1/domains/dataviewer.space/records", {
    method: "PATCH",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `sso-key ${auth_thing}`,
    },
    body: '[{"data": "test","name": "test","ttl": 600,"type": "TXT"}]',
  });
  const txt = await response.text();
  console.log(txt);
}

async function read_records() {
  const response = await fetch("https://api.godaddy.com/v1/domains", {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `sso-key ${auth_thing}`,
    },
  });
  const txt = await response.text();
  console.log(response.status);
  console.log(txt);
}

async function get_customer() {
  const response = await fetch(
    "https://api.ote-godaddy.com/v2/customers/959b3bb1-3b97-48ed-bf6b-f7db6bd95cc5/domains/dataviewer.space",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `sso-key ${auth_thing}`,
      },
    }
  );
  const txt = await response.json();
  console.log(response.status);
  console.log(txt);
}

main();
