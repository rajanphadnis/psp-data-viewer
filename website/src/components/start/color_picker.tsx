import { Accessor, Component, Setter } from "solid-js";

const ColorPicker: Component<{ name: string; accessor: Accessor<string>; setter: Setter<string> }> = (props) => {
  return (
    <div class="flex flex-row items-center my-3 max-md:flex-col max-md:items-start max-md:w-full max-md:my-6">
      <div class="flex flex-row justify-start max-md:mb-2">
        <div style={{ "background-color": props.accessor() }} class={`w-5 h-5 min-w-5 min-h-5 outline-1`}></div>
        <p class="ml-3">{props.name}</p>
      </div>
      <input
        type="text"
        class="outline-1 rounded-md ml-3 p-1 max-md:ml-0"
        value={props.accessor()}
        oninput={(e) => {
          if (/^#([A-Fa-f0-9]{6})$/.test(e.target.value)) {
            props.setter(e.target.value);
          }
        }}
        pattern="^#([A-Fa-f0-9]{6})$"
      />
    </div>
  );
};

export default ColorPicker;
