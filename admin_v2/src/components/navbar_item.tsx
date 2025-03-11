import { A } from "@solidjs/router";
import { Component } from "solid-js";
import RightChevronIcon from "./icons/right_chevron";

const NavBarItem: Component<{ name: string; route: string }> = (props) => {
  return (
    <A href={props.route} style={{ "text-decoration": "none" }}>
      <button class="w-full m-0 p-2.5 flex flex-row justify-between items-center bg-transparent border-0 text-white text-xl font-bold cursor-pointer py-5 text-start hover:bg-cool-grey hover:text-white">
        {props.name}
        <RightChevronIcon />
      </button>
    </A>
  );
};

export default NavBarItem;
