import { Component, Setter } from "solid-js";
import { getDateLabel } from "../../browser_interactions";
import { TestBasics } from "../../types";
import RightChevronIcon from "../icons/right_chevron";

const HomeNavbarItem: Component<{ test: TestBasics; setter: Setter<string>; active: boolean }> = (props) => {
  return (
    <button
      class={`w-full m-0 p-2.5 flex flex-row justify-between border-0 cursor-pointer items-center text-start ${props.active ? "bg-white text-black hover:bg-cool-grey hover:text-white" : "bg-transparent text-white hover:bg-cool-grey hover:text-white"}`}
      on:click={() => {
        props.setter(props.test.id);
      }}
    >
      {props.test.test_article}:{props.test.gse_article}:{getDateLabel(props.test.starting_timestamp!)}:
      {props.test.name} <RightChevronIcon />
    </button>
  );
};

export default HomeNavbarItem;
