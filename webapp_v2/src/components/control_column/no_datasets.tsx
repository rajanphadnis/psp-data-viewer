import { Component } from "solid-js";

const NoDatasetsMessage: Component<{ children?: any }> = (props) => {
  return (
    <div class="flex h-[calc(100%-2rem)] w-full items-center justify-center">
      {props.children}
    </div>
  );
};

export default NoDatasetsMessage;
