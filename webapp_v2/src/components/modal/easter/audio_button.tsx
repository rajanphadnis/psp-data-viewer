import { Component, createSignal, Show } from "solid-js";
import styles from "../modal.module.css";
import sw from "../../../assets/media/sw_trim.mp3";
import { IconPause } from "../../icons/media";

const EasterAudioButton: Component<{
  children?: any;
  name: string;
}> = (props) => {
  const [audio, setaudio] = createSignal<HTMLAudioElement>(new Audio(sw));
  const [audioPlaying, setaudioPlaying] = createSignal<boolean>(false);

  return (
    <button
      class={`${styles.settingsButtonEaster} ${styles.settingsButton}`}
      onclick={() => {
        // console.log("audio");
        if (!audioPlaying()) {
          audio().play();
          setaudioPlaying(true);
        } else {
          audio().pause();
          setaudioPlaying(false);
        }
      }}
      on:contextmenu={(e) => {
        e.preventDefault();
        audio().currentTime = 0;
      }}
    >
      <p class={styles.settingsButtonName}>{props.name}</p>
      <Show when={!audioPlaying()} fallback={<IconPause />}>
        {props.children}
      </Show>
    </button>
  );
};

export default EasterAudioButton;
