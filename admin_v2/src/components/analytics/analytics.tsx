import { Component } from "solid-js";

const Analytics: Component<{}> = (props) => {
  return (
    <iframe
      src="https://lookerstudio.google.com/embed/reporting/962a7679-8c3f-4ec3-b418-6206993f30b3/page/OlEBE"
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      style={{ width: "100%", height: "99%", border: "none", position: "relative", top: "0px" }}
    ></iframe>
  );
};

export default Analytics;
