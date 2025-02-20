import { Component, createSignal, onMount } from "solid-js";
import InputFieldText from "../components/home/contact/input_field";
import { useParams } from "@solidjs/router";
import { decode } from "../state";

const StartPage: Component<{}> = (props) => {
  const [firstName, setFirstName] = createSignal<string>("");
  const [lastName, setLastName] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [orgName, setOrgName] = createSignal<string>("");
  const [orgNameShort, setOrgNameShort] = createSignal<string>("");
  const [slug, setSlug] = createSignal<string>("");
  const [pageTitle, setPageTitle] = createSignal<string>("");
  const [themeColors, setThemeColors] = createSignal<{
    accent: string;
    background: string;
    background_light: string;
    primary: string;
    primary_dark: string;
  }>({
    accent: "#8e6f3e",
    background: "#1D1D1D",
    background_light: "#6f727b",
    primary: "#ddb945",
    primary_dark: "#daaa00",
  });

  onMount(() => {
    const params = window.location.pathname;
    console.log(params);
    // console.log(decode(params));
  });

  return (
    <div class="fixed left-1/2 top-1/2 z-50 min-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-amber-400 bg-neutral-950 px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">
      <h3 class="font-bold text-xl mb-5">Let's get some basic info</h3>
      <InputFieldText
        slug="firstName"
        label="First Name"
        accessor={firstName}
        setter={setFirstName}
        validator={validateName}
      />
      <InputFieldText
        slug="lastName"
        label="Last Name"
        accessor={lastName}
        setter={setLastName}
        validator={validateName}
      />
      <InputFieldText slug="email" label="Your Email" accessor={email} setter={setEmail} validator={validateEmail} />
      <InputFieldText
        slug="orgName"
        label="Organization Name"
        accessor={orgName}
        setter={setOrgName}
        validator={validateName}
      />
      <InputFieldText
        slug="orgNameShort"
        label="Organization Name (Short)"
        accessor={orgNameShort}
        setter={setOrgNameShort}
        validator={(s) => {
          const len1 = orgName().length;
          const len2 = s.length;
          console.log(`${len1} vs ${len2}`);
          return len2 < len1;
        }}
      />
      <InputFieldText slug="slug" label="Slug (?!)" accessor={slug} setter={setSlug} validator={validateSlug} />
      <InputFieldText
        slug="pageTitle"
        label="Page Title"
        accessor={pageTitle}
        setter={setPageTitle}
        validator={validateName}
      />
      <div class="mt-3 flex justify-between">
        <button class="rounded-md bg-red-400 px-3 py-2 text-black cursor-pointer">Cancel</button>
        <button class="rounded-md bg-amber-400 px-3 py-2 font-bold text-black cursor-pointer">Submit</button>
      </div>
    </div>
  );
};

export default StartPage;

export function validateEmail(currentValue: string): boolean {
  if (currentValue.includes("@")) {
    const split = currentValue.split("@");
    if (split[1].includes(".")) {
      const post = split[1].split(".");
      if (post[0].length >= 1 && post[1].length >= 1) {
        return true;
      }
      return false;
    }
    return false;
  }
  return false;
}

export function validateSlug(currentValue: string): boolean {
  return /^[a-zA-Z]+$/.test(currentValue);
}

export function validateName(currentValue: string) {
  return /^[a-zA-Z\d\s-]+$/.test(currentValue);
}
