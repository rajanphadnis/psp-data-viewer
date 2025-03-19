import { Component, createSignal, onMount } from "solid-js";
import { decode } from "../../browser_interactions";

const ExistingRequest: Component<{ requestCode: string; status: string }> = (
  props,
) => {
  const [email, setEmail] = createSignal<string>();
  

  onMount(() => {
    const email = decode(props.requestCode).split(":::")[0];
    setEmail(email);
  });

  return (
    <div>
      <h1 class="mb-1 mt-5 text-xl font-bold">Existing Permissions Request</h1>
      <p>Status: {props.status}</p>
      <p>
        Requested Permissions:{" "}
        {decode(props.requestCode).split(":::")[1].split("::").join(", ")}
      </p>
    </div>
  );
};

export default ExistingRequest;
