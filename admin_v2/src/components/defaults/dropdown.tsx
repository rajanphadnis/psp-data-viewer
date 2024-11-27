import { Accessor, Component, For, Setter } from "solid-js";
import styles from "./defaults.module.css";
import { useState } from "../../state";
import { TestBasics } from "../../types";

const DefaultDropdown: Component<{
  onChange: Setter<string>;
  optionVals: Accessor<string[]>;
  default: Accessor<string>;
  name: string;
  isID?: boolean;
}> = (props) => {
  const [
    allKnownTests,
    setAllKnownTests,
    loadingState,
    setLoadingState,
    defaultTest,
    setDefaultTest,
    defaultGSE,
    setDefaultGSE,
    defaultTestArticle,
    setDefaultTestArticle,
  ]: any = useState();

  return (
    <div>
      <label for={props.name} class={styles.defaultLabel}>
        Default {props.name}:
      </label>
      <select
        name={props.name}
        on:change={(e) => {
          props.onChange(e.target.value);
        }}
        class={styles.defaultSelect}
      >
        <For each={props.optionVals()}>
          {(item, index) => (
            <option value={item} selected={props.default() == item}>
              {!props.isID ? item : (allKnownTests() as TestBasics[]).filter((thing) => thing.id == item)[0].name}
            </option>
          )}
        </For>
      </select>
    </div>
  );
};

export default DefaultDropdown;
