import { updateTestCreateStatus } from "../status";
import { loadingStatus } from "../types";

export function instanceManager() {
  updateTestCreateStatus(loadingStatus.LOADING, "Booting");
  const setButton = document.getElementById("setInstanceButton")! as HTMLButtonElement;
  const getButton = document.getElementById("getInstanceButton")! as HTMLButtonElement;
  setButton.addEventListener("click", async (e) => {
    updateTestCreateStatus(loadingStatus.LOADING, "Setting...");
    setButton!.innerHTML = `<div class="loader-dark"></div>`;
    const inputVal = (document.getElementById("instanceCount")! as HTMLInputElement).value;
    const newInstanceCount = parseInt(inputVal);
    const result = await runRequest(false, newInstanceCount);
    console.log(result);
    setButton.innerHTML = "Instance Count Updated";
    setButton.style.backgroundColor = "greenyellow";
    setButton.disabled = true;
    updateTestCreateStatus(loadingStatus.DONE);
    getButton.click();
  });
  getButton.addEventListener("click", async (e) => {
    updateTestCreateStatus(loadingStatus.LOADING, "Fetching...");
    getButton.innerHTML = `<div class="loader-dark"></div>`;
    // document.getElementById("getInstanceButton")!
    const outputVal = document.getElementById("currentConfig")! as HTMLHeadingElement;
    const newConfig = await runRequest(true);
    outputVal.innerHTML = newConfig;
    getButton.innerHTML = "Get Current Config";
    updateTestCreateStatus(loadingStatus.DONE);
  });
  updateTestCreateStatus(loadingStatus.DONE);
}

async function runRequest(is_fetch: boolean, newCount: number = 0) {
  if (is_fetch) {
    const url = "https://getapiconfig-w547ikcrwa-uc.a.run.app/";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = (await response.json())["result"];
    return JSON.stringify(result, null, 4);
  } else {
    const url = `https://updateapiinstances-w547ikcrwa-uc.a.run.app?instances=${newCount}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    return JSON.stringify(result, null, 4);
  }
}
