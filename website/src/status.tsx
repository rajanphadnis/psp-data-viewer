import { Component } from "solid-js";
import { useState } from "./state.jsx";

const Status: Component<{}> = (props) => {
  const [siteStatus, setSiteStatus] = useState();
  return <div>Site Status: {siteStatus()}</div>;
};

export default Status;
