import { useNavigate } from "@solidjs/router";
import { getAuth, signOut } from "firebase/auth";
import { Component, onMount } from "solid-js";

const Logout: Component<{}> = (props) => {
  onMount(() => {
    console.log("logging out...");
    signOut(getAuth());
    const navigate = useNavigate();
    navigate("/", { replace: true });
  });

  return <p>Logging Out</p>;
};

export default Logout;
