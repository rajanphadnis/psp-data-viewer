import { Accessor, Component, Setter } from "solid-js";

const PricingItemSelector: Component<{
  name: string;
  min: number;
  max: number;
  step: number;
  accessor: Accessor<number>;
  setter: Setter<number>;
  rawToCost: (raw: number) => number;
}> = (props) => {
  return (
    <div class="mb-3">
      <label for={props.name}>{props.name}: {props.accessor()}</label>
      <br />
      <div class="flex flex-row">
        <input
          title={props.name}
          type="range"
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.accessor()}
          oninput={(e) => {
            props.setter(parseInt(e.target.value));
          }}
          class="w-full"
        />
        <p class="ml-3">
          ${props.rawToCost(props.accessor()).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default PricingItemSelector;
