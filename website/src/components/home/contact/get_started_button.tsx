import { Component, createSignal } from "solid-js";
import Dialog from "@corvu/dialog";
import InputFieldText from "./input_field";

const GetStartedButton: Component<{}> = (props) => {
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
  return (
    <Dialog>
      <Dialog.Trigger class="p-3 bg-amber-400 hover:bg-amber-300 hover:shadow-2xl text-black border-2 border-black cursor-pointer whitespace-nowrap rounded-md transition-all duration-100 active:translate-y-0.5 slide-in-from-top-2">
        Get Started
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0%" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 min-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-amber-400 bg-neutral-950 px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">
          <h3 class="font-bold text-xl mb-5">Let's get some basic info</h3>
          <InputFieldText slug="firstName" label="First Name" accessor={firstName} setter={setFirstName} />
          <InputFieldText slug="lastName" label="Last Name" accessor={lastName} setter={setLastName} />
          <InputFieldText slug="email" label="Your Email" accessor={email} setter={setEmail} />
          <InputFieldText slug="orgName" label="Organization Name" accessor={orgName} setter={setOrgName} />
          <InputFieldText
            slug="orgNameShort"
            label="Organization Name (Short)"
            accessor={orgNameShort}
            setter={setOrgNameShort}
          />
          <InputFieldText slug="slug" label="Slug (?!)" accessor={slug} setter={setSlug} />
          <InputFieldText slug="pageTitle" label="Page Title" accessor={pageTitle} setter={setPageTitle} />
          <div class="mt-3 flex justify-between">
            <Dialog.Close class="rounded-md bg-red-400 px-3 py-2 text-black cursor-pointer">Cancel</Dialog.Close>
            <Dialog.Close class="rounded-md bg-amber-400 px-3 py-2 font-bold text-black cursor-pointer">Submit</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default GetStartedButton;
