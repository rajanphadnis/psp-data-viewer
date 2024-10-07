import { doc, getDoc } from "firebase/firestore";
import { loadingStatus } from "../browser/types";
import { updateStatus } from "../dom/status";
import { genDiv } from "./web_components";

export async function home() {
  updateStatus(loadingStatus.LOADING, "Fetching");
  const div = document.getElementById("steps")! as HTMLDivElement;
  const docRef = doc(globalThis.db, "general", "missions");

  console.log(docRef);
  const docSnap = await getDoc(docRef);
  console.log("got doc");
  if (docSnap.exists()) {
    console.log("exists");
    div.innerHTML = "";
    const procs = docSnap.data()["procs"] as { [index: string]: string };
    for (const id of Object.keys(procs)) {
      div.appendChild(genDiv(id, procs[id]));
    }
    updateStatus(loadingStatus.DONE);
  } else {
    // docSnap.data() will be undefined in this case
    updateStatus(loadingStatus.ERROR, "No Mission Info");
    div.innerHTML = "No missions found";
    console.log("No such document!");
    alert("Something went wrong - check your internet connection and try again");
  }
}
