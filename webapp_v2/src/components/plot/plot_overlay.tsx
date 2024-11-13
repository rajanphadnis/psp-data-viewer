import { Component } from "solid-js";
import styles from "./plot.module.css";
import OpenInNewTabIcon from "../icons/open_in_new_tab";

const PlotOverlay: Component<{}> = (props) => {
  return (
    <div class={styles.plotOverlayDiv}>
      Click on a Dataset on the right to get started
      <br /> Drag over area on plot to zoom in
      <br />
      Double-click on plot to reset zoom
      <br />
      <br />
      <a href="https://psp-docs.rajanphadnis.com" target="_blank">
        Documentation
        <OpenInNewTabIcon />
      </a>
      <br />
      <br />
      Data may take up to 10s to load
    </div>
  );
};

export default PlotOverlay;

