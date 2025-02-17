import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import GetStartedButton from "./contact/get_started_button";

const Hero: Component<{}> = (props) => {
  const link = false;
  return (
    <div class="flex flex-col justify-center items-center w-full min-h-2/3">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl font-bold mb-2 text-center">Data Visualization For The Modern Rocketry Team</h1>
        <p class="text-lg mt-5 max-w-2/3 text-center">
          Visualize and Analyze your test data with your entire team - without breaking the bank
        </p>
        <div class="flex flex-row items-center justify-center mt-5">
          <A
            href="#features"
            class="p-3 mr-3 text-white cursor-pointer hover:bg-neutral-700 rounded-md whitespace-nowrap border"
          >
            Explore Features
          </A>
          <Show
            when={link}
            fallback={
              <div class="ml-3">
                <GetStartedButton />
              </div>
            }
          >
            <A
              href="#start"
              class="p-3 ml-3 bg-amber-400 hover:bg-amber-300 hover:shadow-2xl text-black border-2 border-black cursor-pointer whitespace-nowrap rounded-md"
            >
              Get Started
            </A>
          </Show>
        </div>
      </div>
      {/* <img src={heroImage} alt="Dataviewer Demo: Hero Picture" class="w-1/3"></img> */}
    </div>
  );
};

export default Hero;
