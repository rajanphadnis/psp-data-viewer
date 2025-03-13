import Dialog from "@corvu/dialog";
import { Component } from "solid-js";
import { IconJedi } from "../../../icons/easter";
import EasterEggModal from "../../../modal/easter/easter_egg_modal";
import IconButton from "./icon_button";

const ToolEasterEgg: Component<{}> = (props) => {
  return (
    <Dialog>
      <Dialog.Trigger
        title="Easter Egg"
        class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25"
      >
        <IconButton>
          <IconJedi />
        </IconButton>
        <p class="m-0 font-bold text-black">👀</p>
      </Dialog.Trigger>
      <EasterEggModal />
    </Dialog>
  );
};

export default ToolEasterEgg;
