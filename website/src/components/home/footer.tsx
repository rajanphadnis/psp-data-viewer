import { Component } from "solid-js";
import GetStartedButton from "./contact/get_started_button";
import { A } from "@solidjs/router";
import LogoIcon from "../icons/logo";
import { appVersion } from "../../generated_app_info";

const Footer: Component<{}> = (props) => {
  return (
    <div class="flex flex-row justify-between items-start w-full min-h-1/4 h-1/4 bg-black p-5">
      <div class="flex flex-col justify-between items-start h-full min-h-full">
        <A href="/" class="p-0 cursor-pointer text-amber-500 flex flex-row items-center font-bold text-2xl">
          <LogoIcon class="h-10 mr-2" />
          <p class="logo-font-type">Dataviewer.Space</p>
        </A>
        {/* <p class="text-sm">&copy; Dataviewer.Space 2025</p> */}
      </div>
      <div class="flex flex-col">
        <h1 class="text-xl font-bold mb-2">About</h1>
        <A href="/#features" class="text-neutral-500">
          Features
        </A>
        <A href="/#pricing" class="text-neutral-500">
          Pricing
        </A>
        <A href="/#start" class="text-neutral-500">
          Get Started
        </A>
        <A href="" class="text-neutral-500">
          Contact
        </A>
        <A href="/status" class="text-neutral-500">
          Operational Status
        </A>
      </div>
      <div class="flex flex-col">
        <h1 class="text-xl font-bold mb-2">Platform</h1>
        <a href="https://docs.dataviewer.space" target="_blank" class="text-neutral-500">
          Docs
        </a>
        <a href="https://admin.dataviewer.space" target="_blank" class="text-neutral-500">
          Admin Console
        </a>
        <a
          href={`https://github.com/rajanphadnis/psp-data-viewer/releases/download/${appVersion}/dataviewer.exe`}
          target="_blank"
          class="text-neutral-500"
          download
        >
          Data Formatter (.exe)
        </a>
      </div>
      <div class="flex flex-col items-end justify-between h-full min-h-full">
        <p class="max-w-4/5 text-sm">Built by, for, and with student rocketry teams</p>
        <p class="text-sm">&copy; Dataviewer.Space 2025</p>
      </div>
    </div>
  );
};

export default Footer;
