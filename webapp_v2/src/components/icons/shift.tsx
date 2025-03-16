import { Component } from "solid-js";

const ShiftIcon: Component<{ class: string }> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      //   height="24px"
      viewBox="0 -960 960 960"
      //   width="24px"
      //   fill="#e8eaed"
      class={props.class}
    >
      {/* From Material Icons Library: https://fonts.google.com/icons?selected=Material+Symbols+Outlined:shift:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=shift&icon.size=24&icon.color=%23e8eaed */}
      <path d="M320-120v-320H120l360-440 360 440H640v320H320Zm80-80h160v-320h111L480-754 289-520h111v320Zm80-320Z" />
    </svg>
  );
};

export default ShiftIcon;
