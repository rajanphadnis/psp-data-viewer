import { Component, createSignal, onMount, Show } from "solid-js";
import InputFieldText from "../components/home/contact/input_field";
import { useNavigate, useParams } from "@solidjs/router";
import { decode } from "../state";
import ColorPickers from "../components/start/color_pickers";
import ColorPicker from "../components/start/color_picker";

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
  const [primaryColor, setPrimaryColor] = createSignal<string>("#ddb945");
  const [primaryDarkColor, setPrimaryDarkColor] = createSignal<string>("#daaa00");
  const [accentColor, setAccentColor] = createSignal<string>("#8e6f3e");
  const [backgroundColor, setBackgroundColor] = createSignal<string>("#1D1D1D");
  const [backgroundLightColor, setBackgroundLightColor] = createSignal<string>("#6f727b");
  const [loading, setLoading] = createSignal(false);
  const [b64, setB64] = createSignal<string>("");

  onMount(() => {
    const params = useParams();
    setB64(params.b64);
    console.log(params.b64);
    console.log(decode(params.b64));
    const splitParams = decode(params.b64).split(":::");
    setFirstName(splitParams[0]);
    setLastName(splitParams[1]);
    setEmail(splitParams[2]);
    setOrgName(splitParams[3]);
  });

  return (
    <Show
      when={!loading()}
      fallback={
        <div class="flex flex-col w-full h-full justify-center items-center text-center">
          <div class="loader"></div>
          Submitting...
          <br />
          Please don't refresh this page or click the back button while you can read this
        </div>
      }
    >
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
              console.log(`${len1} vs ${len2}`);
              return len2 < len1 && validateName(s);
            }}
          >
            <p>Example: Purdue Space Program Liquids {"->"} PSP Liquids</p>
          </InputFieldText>
          <InputFieldText
            slug="slug"
            label="Organization Slug (short identifier)"
            accessor={slug}
            setter={setSlug}
            validator={validateSlug}
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
          >
            <div>
              <p>The title of the dataviewer page</p>
              <br />
              <p>Example: PSP Liquids {"->"} PSPL Dataviewer</p>
            </div>
          </InputFieldText>
          <p class="mt-8">Feel free to modify your instance's theme colors to match your org:</p>
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
        <div class="flex flex-row justify-end pb-5">
          <button
            class="p-3 px-8 bg-amber-400 rounded-md text-black font-bold hover:bg-amber-300 cursor-pointer"
            onclick={() => {
              setLoading(true);
              window.location.pathname = `/finish/${b64()}`;
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Show>
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
  return /^[a-z]+$/.test(currentValue);
}

export function validateName(currentValue: string) {
  return /^[a-zA-Z\d\s-]+$/.test(currentValue);
}
