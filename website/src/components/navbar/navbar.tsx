import { Component, createSignal, onMount } from "solid-js";
import StatusChip from "./status";
import OpenIcon from "../icons/open";
import { A } from "@solidjs/router";
import { doc, getDoc } from "firebase/firestore";
import { SiteStatus, stringToSiteStatus } from "../../types";
import { LogoIcon, LogoIconMobile } from "../icons/logo";
import BarsIcon from "../icons/bars";

const NavBar: Component<{ featuresDiv?: HTMLDivElement }> = (props) => {
  const [overallStatus, setOverallStatus] = createSignal<SiteStatus>(SiteStatus.UNKNOWN);
  onMount(async () => {
    setOverallStatus(SiteStatus.LOADING);
    const docRef = doc(globalThis.db, "status", "general");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setOverallStatus(stringToSiteStatus(data["overview"]["status"]));
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setOverallStatus(SiteStatus.UNKNOWN);
    }
  });

  return (
    <div class="w-full p-5">
      <div class="flex flex-row w-full justify-between items-center shadow-amber-400 bg-neutral-700/75 border-b-amber-400 border-b-2 border-t-0 border-l-0 border-r-0">
        <div class="flex flex-row w-full">
          <div class="px-0 flex flex-row justify-between max-md:w-full max-md:pl-4">
            <div
              class="flex flex-col justify-center items-center md:hidden"
              onclick={(e) => {
                document.getElementById("mobileNavbar")?.classList.toggle("hidden");
                document.getElementById("mobileNavbar")?.classList.toggle("flex");
              }}
            >
              <BarsIcon class="w-5 fill-white" />
            </div>
            <A href="/" class="p-3 mx-0 hover:bg-neutral-600 cursor-pointer flex flex-row items-center font-bold">
              <LogoIconMobile class="h-6 mr-2" />
              <p class="logo-font-type">Dataviewer.Space</p>
            </A>
          </div>
          <div class="flex flex-row items-center max-md:hidden">
            {/* <A href="/" class="p-3 hover:bg-neutral-600 cursor-pointer flex flex-row items-center font-bold">
            <LogoIcon class="h-6 mr-2" />
            <p class="logo-font-type">Dataviewer.Space</p>
          </A> */}
            <A href="/#features" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
              Features
            </A>
            <A href="/#pricing" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
              Pricing
            </A>
            <A href="/#start" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
              Get Started
            </A>
          </div>
        </div>
        <div class="flex flex-row items-center max-md:hidden">
          <StatusChip link="./status" status={overallStatus()} generic={true} />
          <A
            href="https://pspl.space"
            target="__blank"
            class="p-3 bg-amber-400 text-black font-bold hover:bg-amber-300 cursor-pointer flex flex-row"
          >
            <p>Launch</p>
            <OpenIcon class="w-3 ml-2" />
          </A>
        </div>
      </div>
      <div class="hidden flex-col items-center border-b-amber-400 border-b-2" id="mobileNavbar">
        <A href="/#features" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
          Features
        </A>
        <A href="/#pricing" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
          Pricing
        </A>
        <A href="/#start" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
          Get Started
        </A>
        <StatusChip link="./status" status={overallStatus()} generic={true} />
      </div>
    </div>
  );
};

export default NavBar;
