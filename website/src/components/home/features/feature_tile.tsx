import { Component } from "solid-js";

const FeatureTile: Component<{ name: string; desc: string; icon: Component<{ class?: string }> }> = (props) => {
  return (
    <div class="flex flex-row mb-1 hover:bg-neutral-700 w-2/3 max-md:w-full rounded-2xl p-2 items-center">
      <div class="p-3 flex flex-col justify-center items-center mr-3 bg-neutral-600 rounded-full">
        <props.icon class="fill-white h-5 w-5" />
      </div>
      <div class="flex flex-col">
        <p class="text-lg font-bold">{props.name}</p>
        <p class="">{props.desc}</p>
      </div>
    </div>
  );
};

export default FeatureTile;
