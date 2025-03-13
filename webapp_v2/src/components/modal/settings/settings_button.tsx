import { Component } from "solid-js";

const SettingsButton: Component<{
  children?: any;
  name: string;
  onclick: () => void;
}> = (props) => {
  return (
    <button
      class="bg-rush hover:bg-rush-light m-5 flex h-26 w-40 cursor-pointer flex-col items-center justify-evenly border-none text-center text-black"
      onclick={() => {
        props.onclick();
      }}
    >
      <p class="mt-0 font-bold">{props.name}</p>
      {props.children}
    </button>
  );
};

export default SettingsButton;
