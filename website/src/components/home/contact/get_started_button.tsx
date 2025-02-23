import { Component, createSignal } from "solid-js";
import Dialog from "@corvu/dialog";
import InputFieldText from "./input_field";
import { validateEmail, validateName, validateZipCode } from "../../../pages/start";
import { useSearchParams } from "@solidjs/router";
import { encode } from "../../../state";
import { formatName } from "../../../misc";

const GetStartedButton: Component<{}> = () => {
  const [firstName, setFirstName] = createSignal<string>("");
  const [lastName, setLastName] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [orgName, setOrgName] = createSignal<string>("");
  const [zipCode, setZipCode] = createSignal<string>("");

  function validateInputs(): (boolean | { first: string, last: string, email: string, org: string, zipCode: string }) {
    let toReturn = { first: "", last: "", email: "", org: "", zipCode: "" };
    let failed = false;
    if (firstName() == "") {
      toReturn.first = "Missing first name";
      failed = true;
    }
    if (lastName() == "") {
      toReturn.last = "Missing last name";
      failed = true;
    }
    if (!validateEmail(email())) {
      toReturn.email = "Email is not formatted properly";
      failed = true;
    }
    if (email() == "") {
      toReturn.email = "Missing email";
      failed = true;
    }
    if (orgName() == "") {
      toReturn.org = "Missing organization name";
      failed = true;
    }
    if (zipCode() == "") {
      toReturn.zipCode = "Missing zip code";
      failed = true;
    }
    if (!validateZipCode(zipCode())) {
      toReturn.zipCode = "Zip Code not formatted properly";
      failed = true;
    }
    if (failed) {
      return toReturn;
    }
    else {
      return true;
    }
  }

  return (
    <Dialog>
      <Dialog.Trigger class="p-3 bg-amber-400 hover:bg-amber-300 hover:shadow-2xl text-black border-2 border-black cursor-pointer whitespace-nowrap rounded-md transition-all duration-100 active:translate-y-0.5 slide-in-from-top-2">
        Get Started
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0%" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 min-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-amber-400 bg-neutral-950 px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">
          <h3 class="font-bold text-xl mb-5">Let's get some basic info</h3>
          <InputFieldText
            slug="firstName"
            label="First Name"
            accessor={firstName}
            setter={setFirstName}
            validator={validateName}
            inputRestrictor={validateName}
          />
          <InputFieldText
            slug="lastName"
            label="Last Name"
            accessor={lastName}
            setter={setLastName}
            validator={validateName}
            inputRestrictor={validateName}
          />
          <InputFieldText
            slug="email"
            label="Your Email"
            accessor={email}
            setter={setEmail}
            validator={validateEmail}
            inputRestrictor={() => true}
          />
          <InputFieldText
            slug="zipCode"
            label="Billing Zip Code"
            accessor={zipCode}
            setter={setZipCode}
            validator={validateZipCode}
            inputRestrictor={(s) => {
              return /^[0-9]{0,5}(-[0-9]{0,4})?$/.test(s);
            }}
          />
          <InputFieldText
            slug="orgName"
            label="Full Organization Name"
            accessor={orgName}
            setter={setOrgName}
            validator={validateName}
            inputRestrictor={validateName}
          >
            <p>You'll have the chance to set up a shorter name later</p>
          </InputFieldText>
          <div class="mt-3 flex justify-between">
            <Dialog.Close class="rounded-md bg-red-400 px-3 py-2 text-black cursor-pointer">Cancel</Dialog.Close>
            <button
              class="rounded-md bg-amber-400 px-3 py-2 text-black cursor-pointer"
              onclick={() => {
                const validate = validateInputs();
                if (validate == true || validate == false) {
                  const b64 = encode(
                    `${formatName(firstName())}:::${formatName(lastName())}:::${email()}:::${formatName(
                      orgName()
                    )}:::${zipCode()}`
                  );
                  window.location.pathname = `/start/${b64}`;
                }
                else {
                  let val = "";
                  if (validate.first != "") {
                    val = `${val}\n${validate.first}`;
                  }
                  if (validate.last != "") {
                    val = `${val}\n${validate.last}`;
                  }
                  if (validate.email != "") {
                    val = `${val}\n${validate.email}`;
                  }
                  if (validate.zipCode != "") {
                    val = `${val}\n${validate.zipCode}`;
                  }
                  if (validate.org != "") {
                    val = `${val}\n${validate.org}`;
                  }
                  alert(`Correct these errors before continuing:\n${val}`);
                }

              }}
            >
              Next
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default GetStartedButton;
