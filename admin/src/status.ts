import { check_mark } from "./icons";
import { loadingStatus } from "./types";
import { loader } from "./web_components";

export function updateStatus(status: loadingStatus) {
  if (status == loadingStatus.LOADING) {
    document.getElementById("status")!.innerHTML = loader;
  }
  if (status == loadingStatus.DONE) {
    document.getElementById("status")!.innerHTML = check_mark;
  }
}

export function updateTestCreateStatus(status: loadingStatus, message: string = "Ready") {
  if (status == loadingStatus.LOADING) {
    document.getElementById("status")!.innerHTML = loader;
    document.getElementById("statusMessage")!.innerHTML = message;
  }
  if (status == loadingStatus.DONE) {
    document.getElementById("status")!.innerHTML = check_mark;
    document.getElementById("statusMessage")!.innerHTML = message;
  }
}
