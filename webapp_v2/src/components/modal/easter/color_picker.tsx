import { Component, createSignal, Show } from "solid-js";
import { HexColorPicker } from "solid-colorful";
import styles from "../../control_column/panels/dataset_selector/color_picker.module.css";
import { useState } from "../../../state";
import useClickOutside from "../../../browser/click_outside";

const SettingsColorPicker: Component<{ color: any; setColor: any }> = (props) => {
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
    console.log("clicked outside");
  });

  return (
    <div class={styles.picker} ref={setTarget}>
      <div
        class={styles.swatch}
        style={{ "background-color": props.color() }}
        onClick={() =>
          toggle((b) => {
            // updateColor(props.dataset_id, color());
            return !b;
          })
        }
      />
      <Show when={isOpen()}>
        <div class={styles.popover}>
          <HexColorPicker color={props.color()} onChange={props.setColor} />
        </div>
      </Show>
    </div>
  );
};

export default SettingsColorPicker;
