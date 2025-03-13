import { HexColorPicker } from "solid-colorful";
import { Component, createSignal, Show } from "solid-js";
import useClickOutside from "../../../browser/click_outside";

const SettingsColorPicker: Component<{ color: any; setColor: any }> = (
  props,
) => {
  const [isOpen, toggle] = createSignal<boolean>(false);
  //   const [color, setColor] = createSignal<string>(plotPalletteColors()[activeDatasets().indexOf(props.dataset_id) % plotPalletteColors().length]);
  const [target, setTarget] = createSignal<HTMLElement | undefined>();

  useClickOutside(target, () => {
    toggle((b) => {
      if (b) {
        // updateColor(props.dataset_id, color());
      }
      return false;
    });
    // console.log("clicked outside");
  });

  return (
    <div ref={setTarget}>
      <div
        class="mr-1.5 h-6 w-6 cursor-pointer border-none"
        style={{ "background-color": props.color() }}
        onClick={() =>
          toggle((b) => {
            // updateColor(props.dataset_id, color());
            return !b;
          })
        }
      />
      <Show when={isOpen()}>
        <div class="absolute z-99 rounded-lg shadow-lg">
          <HexColorPicker color={props.color()} onChange={props.setColor} />
        </div>
      </Show>
    </div>
  );
};

export default SettingsColorPicker;
