import { check_mark, red_x } from "../browser/icons";
import { loadingStatus } from "../browser/types";
import { loader } from "../procs/web_components";

export function updateStatus(status: loadingStatus, message: string = "Ready") {
  if (status == loadingStatus.LOADING) {
    document.getElementById("status")!.innerHTML = loader;
    document.getElementById("statusMessage")!.innerHTML = message;
  }
  if (status == loadingStatus.DONE) {
    document.getElementById("status")!.innerHTML = check_mark;
    document.getElementById("statusMessage")!.innerHTML = message;
  }
  if (status == loadingStatus.ERROR) {
    document.getElementById("status")!.innerHTML = red_x;
    document.getElementById("statusMessage")!.innerHTML = message;
  }
}
