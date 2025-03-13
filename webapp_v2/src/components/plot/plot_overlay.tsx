import { Component } from "solid-js";
import { config } from "../../generated_app_info";
import OpenInNewTabIcon from "../icons/open_in_new_tab";

const PlotOverlay: Component<{}> = (props) => {
  return (
    <div class="fixed z-2 mr-auto ml-auto flex h-[-webkit-fill-available] w-85/100 flex-col items-center justify-center text-center font-bold text-white">
      Click on a Dataset on the right to get started
      <br /> Drag over area on plot to zoom in
      <br />
      Double-click on plot to reset zoom
      <br />
      <br />
      <a
        href={config.urls.docs_url}
        target="_blank"
        class="flex flex-row items-center justify-center underline visited:text-white"
      >
        Documentation
        <OpenInNewTabIcon class="ml-2 w-3 fill-white" />
      </a>
      <br />
      <br />
      Data may take up to 10s to load
    </div>
  );
};

export default PlotOverlay;
