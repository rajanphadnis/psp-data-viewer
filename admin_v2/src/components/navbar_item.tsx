import { Component } from "solid-js";
import styles from "./resizeable.module.css";
import RightChevronIcon from "./icons/right_chevron";
import { A, useNavigate } from "@solidjs/router";

const NavBarItem: Component<{ name: string; route: string }> = (props) => {
  return (
    <A href={props.route} style={{ "text-decoration": "none" }}>
      <button class={styles.navbarItem}>
        {props.name}
        <RightChevronIcon />
      </button>
    </A>
  );
};

export default NavBarItem;
