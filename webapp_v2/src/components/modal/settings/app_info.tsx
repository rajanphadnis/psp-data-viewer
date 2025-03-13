import { Component } from "solid-js";
import { appVersion, buildDate, config } from "../../../generated_app_info";

const AppInfo: Component<{}> = (props) => {
  return (
    <p class="mb-4 ml-4 text-start text-sm font-bold text-neutral-500">
      Running webapp {appVersion}, built on {buildDate}.{" "}
      <a
        class="underline text-neutral-500 visited:text-neutral-500"
        href={`${config.urls.github_url}/releases/tag/${appVersion}`}
        target="_blank"
      >
        View Changelog and Release Notes
      </a>
    </p>
  );
};

export default AppInfo;
