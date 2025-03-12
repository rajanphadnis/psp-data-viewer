import { Component, Show } from "solid-js";
import styles from "./title.module.css";

const SectionTitle: Component<{ title: string; url?: string }> = (props) => {

  return <Show when={props.url} fallback={<p class={styles.title}>{props.title}</p>}>
    <div>
      <p class={styles.title}>{props.title}</p>;
      <a href={props.url}>Open Test</a>
    </div>
  </Show>
};

export default SectionTitle;