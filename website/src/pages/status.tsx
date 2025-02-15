import { Component } from "solid-js";
import { useState } from "../state";
import NavBar from "../components/navbar/navbar";

const Status: Component<{}> = (props) => {
  const [siteStatus, setSiteStatus] = useState();
  return (
    <div class="w-full h-full">
      <NavBar />
      <div class="flex flex-row justify-around w-full mt-5">Status</div>
    </div>
  );
};

export default Status;
