import { Component, createSignal } from "solid-js";
import styles from "../modal.module.css";

const EasterClickButton: Component<{
  children?: any;
  name: string;
}> = (props) => {
  const [count, setcount] = createSignal<number>(0);

  return (
    <button
      class={`${styles.settingsButtonEaster} ${styles.settingsButton}`}
      onclick={() => {
        if (count() > 3) {
          alert(`Set count: ${count()}`);
          setcount(0);
        } else {
          setcount((old) => old + 1);
        }
      }}
    >
      <p class={styles.settingsButtonName}>{props.name}</p>
      {props.children}
    </button>
  );
};

export default EasterClickButton;
