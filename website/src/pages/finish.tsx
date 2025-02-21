import { useParams } from "@solidjs/router";
import { Component, createSignal, onMount } from "solid-js";
import { decode } from "../state";
import { stripe_pk } from "../generated_app_info";
import { loadStripe } from "@stripe/stripe-js";
import Stepper from "../components/finish/stepper";

const FinishPage: Component<{}> = (props) => {
  const [email, setEmail] = createSignal<string>("");


  onMount(async () => {
    const params = window.location.pathname.slice(8).split("?")[0];
    const splitParams = decode(params).split(":::");
    setEmail(splitParams[0]);
    const stripe = await loadStripe(stripe_pk);
    stripe!.retrieveSetupIntent(splitParams[1]).then(({ setupIntent }) => {
      const message = document.getElementById("messages")!;
      switch (setupIntent!.status) {
        case "succeeded": {
          message.innerText = "Success! Your payment method has been saved.";
          break;
        }

        case "processing": {
          message.innerText = "Processing payment details. We'll update you when processing is complete.";
          break;
        }

        case "requires_payment_method": {
          message.innerText = "Failed to process payment details. Please try another payment method.";

          // Redirect your user back to your payment page to attempt collecting
          // payment again

          break;
        }
      }
    });
  });

  return (
    <div class="flex flex-row w-full h-full justify-start items-center text-center">
      <div class="pl-10 h-full flex flex-col justify-center">
        <Stepper />
      </div>
      <div class="w-full h-full flex flex-col justify-center px-24">
        <p>Awesome! We'll get back to you once we've reviewed your request and are ready to provision your instance!</p>
        <br />
        <p>Monitor your email ({email()}) for next steps - we'll try to get back to you within 24 hours</p>
        <p id="messages"></p>
      </div>
    </div>
  );
};

export default FinishPage;
