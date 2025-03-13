import { Component } from "solid-js";

const FilterButton: Component<{
  name: string;
  onclick: () => void;
  isActive: boolean;
}> = (props) => {
  return (
    <button
      class={`mx-1.5 my-0 cursor-pointer border border-white px-5 ${props.isActive ? "hover:bg-cool-grey bg-white text-black" : "hover:bg-cool-grey bg-transparent text-white"}`}
      onclick={() => {
        props.onclick();
      }}
    >
      <p>{props.name}</p>
    </button>
  );
};

export default FilterButton;
