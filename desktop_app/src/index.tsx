/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { disableRefresh } from "./misc";

disableRefresh();

render(() => <App />, document.getElementById("root") as HTMLElement);
