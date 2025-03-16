import { Component } from "solid-js";

const CtrlKeyIcon: Component<{ class: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      class={props.class}
    >
      <path d="m256-424-56-56 280-280 280 280-56 56-224-223-224 223Z" />
    </svg>
  );
};

export default CtrlKeyIcon;
