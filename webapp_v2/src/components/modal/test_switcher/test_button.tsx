import { Component } from "solid-js";

const TestEntry: Component<{ children?: any; test_id: string }> = (props) => {
  return (
    <button
      class="bg-bg hover:bg-cool-grey w-full cursor-pointer border-none py-2.5 text-start text-lg text-white"
      onclick={() => {
        window.location.href = window.location.origin + "/" + props.test_id;
      }}
    >
      {props.children}
    </button>
  );
};

export default TestEntry;
