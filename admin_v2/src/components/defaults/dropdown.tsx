import { Accessor, Component, createMemo, For, Setter } from "solid-js";
import styles from "./defaults.module.css";
import { useState } from "../../state";
import { TestBasics } from "../../types";
import { getDateLabel } from "../../browser_interactions";

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
    auth,
    setAuth,
    org,
    setOrg,
  ] = useState();

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
          {(item, index) => {
            const filteredItem = (allKnownTests() as TestBasics[]).filter((thing) => thing.id == item)[0];
            return (
              <option value={item} selected={props.default() == item}>
                {!props.isID ? item : `${getDateLabel(filteredItem.starting_timestamp!)}:${filteredItem.name}`}
              </option>
            );
          }}
        </For>
      </select>
    </div>
  );
};

export default DefaultDropdown;
