import { Component } from "solid-js";
import { useState } from "../state";
import NavBar from "../components/navbar/navbar";
import Footer from "../components/home/footer";
import StatusList from "../components/status/status_list";
import StatusExplainer from "../components/status/status_explainer";

const Status: Component<{}> = (props) => {
  const [siteStatus, setSiteStatus] = useState();
  return (
    <div class="w-full h-full">
      <NavBar />
      <div class="flex flex-col justify-around items-center w-full mt-5 px-12">
        <h1 class="text-4xl font-bold mb-8 w-full">Status</h1>
        <p class="text-xl mb-12 w-full">Overall platform status</p>
        <StatusList />
        <StatusExplainer />
      </div>
      <Footer />
    </div>
  );
};

export default Status;
