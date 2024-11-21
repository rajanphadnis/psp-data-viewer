import { Component } from "solid-js";
import styles from "./switcher.module.css";

const FilterButton: Component<{ name: string; onclick: () => void }> = (props) => {
  return (
    <button
      class={styles.filterButton}
      onclick={() => {
        props.onclick();
      }}
    >
      <p>{props.name}</p>
    </button>
  );
};

export default FilterButton;
