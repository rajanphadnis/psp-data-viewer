import { Component } from "solid-js";

const IconSum: Component<{ class: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // height="15px"
      viewBox="0 -960 960 960"
      // width="15px"
      // fill="#000000"
      class={props.class}
    >
      <path d="M240-160v-80l260-240-260-240v-80h480v120H431l215 200-215 200h289v120H240Z" />
    </svg>
  );
};

export default IconSum;
