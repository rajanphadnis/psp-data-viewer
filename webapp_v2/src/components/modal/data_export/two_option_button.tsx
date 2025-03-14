import { Accessor, Component, Setter } from "solid-js";

const TwoOptionExportButton: Component<{
  val: Accessor<boolean>;
  set: Setter<boolean>;
  trueVal: string;
  falseVal: string;
}> = (props) => {
  return (
    <div class="flex h-54 flex-col">
      <button
        onclick={(e) => {
          props.set(true);
        }}
        class={`hover:bg-rush-light mb-1 w-full cursor-pointer px-3 font-bold text-black ${props.val() ? "bg-rush h-85/100" : "bg-aged h-15/100"}`}
      >
        {props.trueVal}
      </button>
      <button
        onclick={(e) => {
          alert("Feature not available (still under development)");
          // props.set(false);
        }}
        class={`hover:bg-rush-light w-full cursor-pointer px-3 font-bold text-black ${props.val() ? "bg-aged h-15/100" : "bg-rush h-85/100"}`}
      >
        {props.falseVal}
      </button>
    </div>
  );
};

export default TwoOptionExportButton;
