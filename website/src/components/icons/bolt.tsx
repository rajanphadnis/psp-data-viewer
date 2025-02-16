import { Component } from "solid-js";

const BoltIcon: Component<{ class?: string }> = (props) => {
  // Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class={props.class}>
      <path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z" />
    </svg>
  );
};

export default BoltIcon;
