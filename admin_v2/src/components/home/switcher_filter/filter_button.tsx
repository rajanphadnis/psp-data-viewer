import { Component } from "solid-js";
import styles from "./switcher.module.css";

const FilterButton: Component<{ name: string; onclick: () => void; isActive: boolean }> = (props) => {
  return (
    <button
      class={`${styles.filterButton} ${props.isActive ? styles.filterButtonActive : styles.filterButtonInactive}`}
      onclick={() => {
        props.onclick();
      }}
    >
      <p>{props.name}</p>
    </button>
  );
};

export default FilterButton;
