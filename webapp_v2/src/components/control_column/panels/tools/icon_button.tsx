import { Component, JSX } from "solid-js";

const IconButton: Component<{ children?: JSX.Element }> = (props) => {
  return <div class="mr-1.25 p-1.25 pb-0.5">{props.children}</div>;
};

export default IconButton;
