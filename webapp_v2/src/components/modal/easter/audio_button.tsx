import { Component, createSignal, Show } from "solid-js";
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
      class="bg-rush hover:bg-rush-light m-5 flex h-26 w-40 cursor-pointer flex-col items-center justify-evenly border-none text-center text-black"
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
      <p class="mt-0 font-bold">{props.name}</p>
      <Show
        when={!audioPlaying()}
        fallback={<IconPause class="w-3.75 fill-black" />}
      >
        {props.children}
      </Show>
    </button>
  );
};

export default EasterAudioButton;
