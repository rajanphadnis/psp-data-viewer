import { Component } from "solid-js";
import GetStartedButton from "./contact/get_started_button";

const ContactSegment: Component<{}> = (props) => {
  return (
    <div id="start" class="flex flex-col justify-center items-center w-full min-h-1/2">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl font-bold mb-2 text-center">Get Started</h1>
        <p class="text-lg mt-5 max-w-2/3 text-center">
          We'll be in touch about setting up your instance once you fill out this form or something....
        </p>
        <div class="flex flex-row items-center justify-center mt-5">
          <GetStartedButton />
        </div>
      </div>
    </div>
  );
};

export default ContactSegment;
