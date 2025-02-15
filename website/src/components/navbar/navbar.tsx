import { Component, createSignal, onMount } from "solid-js";
import StatusChip from "./status";
import OpenIcon from "../icons/open";
import { A } from "@solidjs/router";
import { doc, getDoc } from "firebase/firestore";
import { SiteStatus, stringToSiteStatus } from "../../types";

const NavBar: Component<{}> = (props) => {
  const [overallStatus, setOverallStatus] = createSignal<SiteStatus>(SiteStatus.UNKNOWN);
  onMount(async () => {
    setOverallStatus(SiteStatus.LOADING);
    const docRef = doc(globalThis.db, "status", "general");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setOverallStatus(stringToSiteStatus(data["overview"]));
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      setOverallStatus(SiteStatus.UNKNOWN);
    }
  });

  return (
    <div class="w-full p-5">
      <div class="flex flex-row w-full justify-between shadow-amber-400 bg-neutral-700/75 border-b-amber-400 border-b-2 border-t-0 border-l-0 border-r-0">
        <div class="flex flex-row">
          <A href="/" class="p-3 hover:bg-neutral-600 cursor-pointer text-amber-500">
            Dataviewer.space
          </A>
          <A href="/#platform" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
            Platform
          </A>
          <A href="/#pricing" class="p-3 hover:bg-neutral-600 cursor-pointer hover:underline underline-offset-3">
            Pricing
          </A>
        </div>
        <div class="flex flex-row">
          <StatusChip link="./status" status={overallStatus} />
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
    </div>
  );
};

export default NavBar;
