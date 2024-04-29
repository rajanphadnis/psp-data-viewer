import { loadingStatus } from "./types";
import { check_mark, loader } from "./web_components";

export function updateStatus(status: loadingStatus) {
  if (status == loadingStatus.LOADING) {
    document.getElementById("status")!.innerHTML = loader;
  }
  if (status == loadingStatus.DONE) {
    document.getElementById("status")!.innerHTML = check_mark;
  }
}
