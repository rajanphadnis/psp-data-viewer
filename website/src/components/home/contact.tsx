import { Component } from "solid-js";
import GetStartedButton from "./contact/get_started_button";

const ContactSegment: Component<{}> = (props) => {
  return (
    <div id="start" class="flex flex-col justify-center items-center w-full min-h-1/2">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl font-bold mb-2 text-center">Get Started</h1>
        <p class="text-lg mt-5 max-w-2/3 text-center">
          No complicated sales process or back-and-forth over email. Just fill out your info and we'll provision an instance for you in as little as 5 minutes!
        </p>
        <div class="flex flex-row items-center justify-center mt-5">
          <GetStartedButton />
        </div>
      </div>
    </div>
  );
};

export default ContactSegment;
