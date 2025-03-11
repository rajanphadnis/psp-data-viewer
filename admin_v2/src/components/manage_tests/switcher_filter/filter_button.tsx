import { Component } from "solid-js";

const FilterButton: Component<{ name: string; onclick: () => void; isActive: boolean }> = (props) => {
  return (
    <button
      class={`border border-white mx-1.5 my-0 p-0 px-5 cursor-pointer ${props.isActive ? "bg-white text-black hover:bg-cool-grey" : "bg-transparent text-white hover:bg-cool-grey"}`}
      onclick={() => {
        props.onclick();
      }}
    >
      <p>{props.name}</p>
    </button>
  );
};

export default FilterButton;
