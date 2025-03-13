import { Component, createSignal } from "solid-js";

const EasterClickButton: Component<{
  children?: any;
  name: string;
}> = (props) => {
  const [count, setcount] = createSignal<number>(0);

  return (
    <button
      class="bg-rush hover:bg-rush-light m-5 flex h-26 w-40 cursor-pointer flex-col items-center justify-evenly border-none text-center text-black"
      onclick={() => {
        if (count() > 3) {
          alert(`Set count: ${count()}`);
          setcount(0);
        } else {
          setcount((old) => old + 1);
        }
      }}
    >
      <p class="mt-0 font-bold">{props.name}</p>
      {props.children}
    </button>
  );
};

export default EasterClickButton;
