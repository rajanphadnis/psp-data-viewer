import { Component } from "solid-js";
import IconSum from "../../../icons/sum";
import IconButton from "./icon_button";

const ToolCalcChannel: Component<{}> = (props) => {
  return (
    <button class="hover:bg-rush-light bg-rush mb-1.25 flex w-full cursor-pointer flex-row items-center justify-start border-none p-1.25">
      <IconButton>
        <IconSum />
      </IconButton>
      <p class="m-0 font-bold text-black">Calc Channels</p>
    </button>
  );
};

export default ToolCalcChannel;
