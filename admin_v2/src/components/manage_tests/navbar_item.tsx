import { Component, Setter } from "solid-js";
import RightChevronIcon from "../icons/right_chevron";
import styles from "./home.module.css";
import { TestBasics } from "../../types";
import { getDateLabel } from "../../browser_interactions";

const HomeNavbarItem: Component<{ test: TestBasics; setter: Setter<string>; active: boolean }> = (props) => {
  return (
    <button
      class={`${styles.homeNavbarItem} ${props.active ? styles.homeNavbarItemSelected : styles.homeNavbarItemDefault}`}
      on:click={() => {
        props.setter(props.test.id);
      }}
    >
      {props.test.test_article}:{props.test.gse_article}:{getDateLabel(props.test.starting_timestamp!)}:
      {props.test.name} <RightChevronIcon />
    </button>
  );
};

export default HomeNavbarItem;
