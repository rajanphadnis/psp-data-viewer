import { Component } from "solid-js";
import { appVersion, buildDate } from "../../../generated_app_info";
import styles from "../modal.module.css";

const AppInfo: Component<{}> = (props) => {
  return (
    <p class={styles.appInfo}>
      Running webapp {appVersion}, built on {buildDate}.{" "}
      <a
        class={styles.appLink}
        href={`https://github.com/rajanphadnis/psp-data-viewer/releases/tag/${appVersion}`}
        target="_blank"
      >
        View Changelog and Release Notes
      </a>
    </p>
  );
};

export default AppInfo;