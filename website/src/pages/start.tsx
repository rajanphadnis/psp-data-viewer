import { Component, createSignal, onMount, Show } from "solid-js";
import InputFieldText from "../components/home/contact/input_field";
import { decode, encode } from "../state";
import ColorPicker from "../components/start/color_picker";
import { httpsCallable } from "firebase/functions";
import { addDoc, collection } from "firebase/firestore";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { reservedSlugs, stripe_pk } from "../generated_app_info";
import Popover from "@corvu/popover";
import HelpIcon from "../components/icons/help";
import { formatName } from "../misc";

const StartPage: Component<{}> = (props) => {
  const [firstName, setFirstName] = createSignal<string>("");
  const [lastName, setLastName] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [orgName, setOrgName] = createSignal<string>("");
  const [orgNameShort, setOrgNameShort] = createSignal<string>("");
  const [slug, setSlug] = createSignal<string>("");
  const [pageTitle, setPageTitle] = createSignal<string>("");
  const [primaryColor, setPrimaryColor] = createSignal<string>("#ddb945");
  const [primaryDarkColor, setPrimaryDarkColor] = createSignal<string>("#daaa00");
  const [accentColor, setAccentColor] = createSignal<string>("#8e6f3e");
  const [backgroundColor, setBackgroundColor] = createSignal<string>("#1D1D1D");
  const [backgroundLightColor, setBackgroundLightColor] = createSignal<string>("#6f727b");
  const [zipCode, setZipCode] = createSignal<string>("");
  const [elements, setElements] = createSignal<StripeElements>();
  const [stripe, setStripe] = createSignal<Stripe>();
  const [loading, setLoading] = createSignal(false);

  function validateInputs(): (boolean | { orgShort: string, slug: string, title: string }) {
    let toReturn = { orgShort: "", slug: "", title: "" };
    let failed = false;
    if (orgNameShort() == "") {
      toReturn.orgShort = "Missing Organization Name (Short)";
      failed = true;
    }
    if (orgName().length <= orgNameShort().length) {
      toReturn.orgShort = "Organization Name (Short) is too long";
      failed = true;
    }
    if (slug() == "") {
      toReturn.slug = "Missing slug";
      failed = true;
    }
    if ([...reservedSlugs, "tamu", "staging"].includes(slug())) {
      toReturn.slug = "This slug is reserved or already in use"
      failed = true;
    }
    if (pageTitle() == "") {
      toReturn.title = "Missing page title";
      failed = true;
    }
    if (failed) {
      return toReturn;
    }
    else {
      return true;
    }
  }

  onMount(async () => {
    const stripe = await loadStripe(stripe_pk);
    if (stripe) {
      setStripe(stripe);
      const params = window.location.pathname.slice(7);
      const splitParams = decode(params).split(":::");
      setFirstName(splitParams[0]);
      setLastName(splitParams[1]);
      setEmail(splitParams[2]);
      setOrgName(splitParams[3]);
      setZipCode(splitParams[4]);

      const elements = stripe.elements({
        mode: "setup",
        currency: "usd",
        appearance: {
          theme: 'night',
          variables: {
            fontFamily: 'Sohne, system-ui, sans-serif',
            fontWeightNormal: '500',
            colorBackground: '#1D1D1D',
            colorPrimary: '#ffb900',
            accessibleColorOnColorPrimary: '#1A1B25',
            colorText: 'white',
            colorTextSecondary: 'white',
            tabIconColor: 'white',
            logoColor: 'dark'
          },
          rules: {
            '.Input': {
              // backgroundColor: '#212D63',
              backgroundColor: '#404040',
              border: '1px solid var(--colorPrimary)'
            }
          }
        },
      });
      setElements(elements);
      const paymentElement = elements.create("payment", { layout: "accordion" });
      paymentElement.mount("#payment-element");
    } else {
      console.error("couldn't init Stripe");
    }
  });

  return (
    <div class="w-full flex flex-col p-6 justify-between h-full">
      <div class="flex flex-col justify-start">
        <h1 class="font-bold text-3xl mb-5">Hi {firstName()}!</h1>
        <h2 class="font-bold text-xl mb-5">
          To get <span class="text-amber-400">{orgName()}</span> set up, we just need a few more details
        </h2>
        <InputFieldText
          slug="orgNameShort"
          label={`Organization Name (short)`}
          accessor={orgNameShort}
          setter={setOrgNameShort}
          validator={(s) => {
            const len1 = orgName().length;
            const len2 = s.length;
            console.debug(`${len1} vs ${len2}`);
            return len2 < len1 && validateName(s);
          }}
          inputRestrictor={validateName}
        >
          <p>Example: Purdue Space Program Liquids {"->"} PSP Liquids</p>
        </InputFieldText>
        <InputFieldText
          slug="slug"
          label="Organization Slug (short identifier)"
          accessor={slug}
          setter={setSlug}
          validator={validateSlug}
          inputRestrictor={validateSlug}
        >
          <div>
            <p>This can only contain lowercase letters (no numbers, spaces, symbols, or capital letters)</p>
            <br />
            <p>Example: PSP Liquids {"->"} pspl</p>
          </div>
        </InputFieldText>
        <InputFieldText
          slug="pageTitle"
          label="Page Title"
          accessor={pageTitle}
          setter={setPageTitle}
          validator={validateName}
          inputRestrictor={validateName}
        >
          <div>
            <p>The title of the dataviewer page</p>
            <br />
            <p>Example: PSP Liquids {"->"} PSPL Dataviewer</p>
          </div>
        </InputFieldText>
        <div class="w-full flex flex-row mt-8 mb-12 max-md:flex-col">
          <div class="w-1/2 flex flex-col max-md:w-full pr-4">
            <p class="text-lg font-bold">Feel free to modify your instance's theme colors to match your org:</p>
            <ColorPicker name="Primary" accessor={primaryColor} setter={setPrimaryColor} />
            <ColorPicker name="Primary (Dark)" accessor={primaryDarkColor} setter={setPrimaryDarkColor} />
            <ColorPicker name="Accent Color" accessor={accentColor} setter={setAccentColor} />
            <ColorPicker name="Background Color" accessor={backgroundColor} setter={setBackgroundColor} />
            <ColorPicker
              name="Background Color (Light)"
              accessor={backgroundLightColor}
              setter={setBackgroundLightColor}
            />
          </div>
          <div class="flex flex-col justify-start w-1/2 max-md:w-full max-md:mt-8 mt-0.5">
            <div class="mb-4 text-lg font-bold">
              Add a payment method
              <Popover
                floatingOptions={{
                  offset: 13,
                  flip: true,
                  shift: true,
                }}
              >
                <Popover.Trigger class="my-auto mx-3 rounded-full bg-neutral-500 p-1 transition-all duration-100 hover:bg-neutral-600 active:translate-y-0.5 cursor-pointer">
                  <HelpIcon class="fill-white w-3 h-3" />
                  <span class="sr-only">Help</span>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content class="z-50 rounded-lg bg-neutral-500 px-3 py-2 shadow-md data-open:animate-in data-open:fade-in-50% data-open:slide-in-from-top-1 data-closed:animate-out data-closed:fade-out-50% data-closed:slide-out-to-top-1">
                    <div>
                      <p>We won't start your subscription until your instance has been deployed</p>
                    </div>
                    <Popover.Arrow class="text-neutral-500" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover>
            </div>
            <form
              class="w-full"
              id="payment-form"
              onsubmit={async (e) => {
                e.preventDefault();
              }}
            >
              <div id="payment-element"></div>
              <div id="error-message"></div>
            </form>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-end pb-5">
        <button
          class={`p-3 px-8 ${loading() ? "bg-transparent text-white" : "bg-amber-400 hover:bg-amber-300 text-black cursor-pointer"} rounded-md font-bold max-md:w-full`}
          onclick={async () => {
            if (loading()) {
              return;
            } else {
              const validate = validateInputs();
              if (validate == true || validate == false) {
                setLoading(true);
                const elem = elements()!;
                const { error: submitError } = await elem.submit();
                if (submitError) {
                  console.error(submitError);
                  return;
                }
                const fetchStripeInfo = httpsCallable(globalThis.functions, "createCustomerIntentAndCustomerSession");
                fetchStripeInfo({
                  slug: slug(),
                  name: orgName(),
                  zipCode: zipCode(),
                  email: email(),
                }).then(async (result) => {
                  const data: any = result.data;
                  const client_secret = data.client_secret;
                  const customer_id = data.customer_id;
                  console.debug(data);
                  const docRef = await addDoc(collection(globalThis.db, "temp_accounts"), {
                    firstName: firstName(),
                    lastName: lastName(),
                    email: email(),
                    orgName: orgName(),
                    orgNameShort: formatName(orgNameShort()),
                    slug: slug(),
                    pageTitle: formatName(pageTitle()),
                    primaryColor: primaryColor(),
                    primaryDarkColor: primaryDarkColor(),
                    accentColor: accentColor(),
                    backgroundColor: backgroundColor(),
                    backgroundLightColor: backgroundLightColor(),
                    zipCode: zipCode(),
                    customerID: customer_id,
                  });
                  console.debug(docRef.id);
                  const newB64 = encode(`${email()}:::${client_secret}:::${docRef.id}`);
                  const newURL = `${window.location.origin}/finish/${newB64}`;
                  const { error } = await stripe()!.confirmSetup({
                    elements: elem,
                    clientSecret: client_secret,
                    confirmParams: {
                      return_url: newURL,
                    },
                  });
                  if (error) {
                    console.error(error);
                    setLoading(false);
                  }
                });
              }
              else {
                let val = "";
                if (validate.orgShort != "") {
                  val = `${val}\n${validate.orgShort}`;
                }
                if (validate.slug != "") {
                  val = `${val}\n${validate.slug}`;
                }
                if (validate.title != "") {
                  val = `${val}\n${validate.title}`;
                }
                alert(`Correct these errors before continuing:\n${val}`);
              }
            }
          }}
        >
          <Show when={loading()} fallback={"Submit"}>
            <div class="flex flex-row items-center text-white w-full justify-center">
              <p class="mr-6">Do not close or refresh this page</p>
              <div class="loader w-10 h-10 border-t-8 border-8"></div>
            </div>
          </Show>
        </button>
      </div>
    </div>
  );
};

export default StartPage;

export function validateZipCode(currentValue: string) {
  return /^[0-9]{5}(-[0-9]{4})?$/.test(currentValue);
}

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
  return /^[a-z]+$/.test(currentValue);
}

export function validateName(currentValue: string) {
  return /^[a-zA-Z\d\s-]+$/.test(currentValue);
}
