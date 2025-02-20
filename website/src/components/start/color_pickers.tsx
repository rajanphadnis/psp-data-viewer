import { Component, createSignal } from "solid-js";
import ColorPicker from "./color_picker";

const ColorPickers: Component<{}> = (props) => {
  const [primaryColor, setPrimaryColor] = createSignal<string>("#ddb945");
  const [primaryDarkColor, setPrimaryDarkColor] = createSignal<string>("#daaa00");
  const [accentColor, setAccentColor] = createSignal<string>("#8e6f3e");
  const [backgroundColor, setBackgroundColor] = createSignal<string>("#1D1D1D");
  const [backgroundLightColor, setBackgroundLightColor] = createSignal<string>("#6f727b");

  return (
    <div>
      <ColorPicker name="Primary" accessor={primaryColor} setter={setPrimaryColor} />
      <ColorPicker name="Primary (Dark)" accessor={primaryDarkColor} setter={setPrimaryDarkColor} />
      <ColorPicker name="Accent Color" accessor={accentColor} setter={setAccentColor} />
      <ColorPicker name="Background Color" accessor={backgroundColor} setter={setBackgroundColor} />
      <ColorPicker name="Background Color (Light)" accessor={backgroundLightColor} setter={setBackgroundLightColor} />
    </div>
  );
};

export default ColorPickers;
