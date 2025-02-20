import { useParams } from "@solidjs/router";
import { Component, createSignal, onMount } from "solid-js";
import { decode } from "../state";

const FinishPage: Component<{}> = (props) => {
  const [firstName, setFirstName] = createSignal<string>("");
  const [lastName, setLastName] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [orgName, setOrgName] = createSignal<string>("");

  onMount(() => {
    const params = useParams();
    console.log(params.b64);
    console.log(decode(params.b64));
    const splitParams = decode(params.b64).split(":::");
    setFirstName(splitParams[0]);
    setLastName(splitParams[1]);
    setEmail(splitParams[2]);
    setOrgName(splitParams[3]);
  });

  return (
    <div class="flex flex-col w-full h-full justify-center items-center text-center">
      <p>
        Awesome - thanks {firstName()}! We'll get back to you once we've reviewed your request and are ready to
        provision an instance for {orgName()}!
      </p>
      <br />
      <p>Monitor your email ({email()}) for next steps - we'll try to get back to you within 24 hours</p>
    </div>
  );
};

export default FinishPage;
