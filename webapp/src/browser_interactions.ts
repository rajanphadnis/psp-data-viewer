import { toggleMeasuringModal } from "./modals/measuringModal";
import { toggleSettingsModal } from "./modals/settingsModal";
import { toggleSwitcherModal } from "./modals/testSwitcherModal";
import { clearDatums, setPoint1, setPoint2 } from "./tools/measuring";

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}

export function getTestID(default_redirect: string): string {
  let param = location.pathname;
  if (param == undefined || param == "/" || param.length <= 2) {
    param = "/" + default_redirect + "/";
    window.location.href = location.origin + param;
  }
  return param.slice(1, -1);
}

export function getSharelinkList(): boolean {
  let param = getQueryVariable("b64");
  if (param == undefined || param == "") {
    globalThis.activeDatasets_to_add = [];
    return false;
  } else {
    const decodedList = decode(param);
    const paramList = decodedList.split(":::");
    globalThis.activeDatasets_to_add = paramList[0].split(",");
    globalThis.displayedRangeStart = parseInt(paramList[1]);
    globalThis.displayedRangeEnd = parseInt(paramList[2]);
    return true;
  }
}

export function getSharelink(): [string, string] {
  const bufferString = globalThis.activeDatasets_to_add.join(",");
  let b64: string;
  if (bufferString == undefined || bufferString == "") {
    return [location.origin + location.pathname, ""];
  } else {
    b64 = encode(
      globalThis.activeDatasets_to_add.join(",") +
        `:::${globalThis.displayedRangeStart}:::${globalThis.displayedRangeEnd}`
    );
  }
  const sharelink_base = location.origin + location.pathname + "?b64=" + b64;
  return [sharelink_base, b64];
}

const decode = (str: string): string => atob(str);

const encode = (str: string): string => btoa(str);

function fallbackCopyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}
export function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    async function () {
      console.log("Async: Copying to clipboard was successful!");
      const modButton = document.getElementById("sharelinkButton")!;
      modButton.innerHTML = "Copied!";
      await delay(1500);
      modButton.innerHTML = "Share";
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function setTitle(name: string, test_article: string, gse_article: string) {
  const titleElement = document.getElementById("title")!;
  const tabTitle = document.getElementById("tabTitle")!;
  titleElement.innerHTML = "PSP Data Viewer::" + test_article + ":" + gse_article + ":" + name;
  tabTitle.innerHTML = test_article + ":" + gse_article + ":" + name;
}

export function addKeyPressListeners() {
  document.onkeydown = (e) => {
    if (e.key == "Escape") {
      clearDatums(globalThis.uplot);
    }
    if (e.key == "e") {
      toggleMeasuringModal();
    }
    if (e.key == "s") {
      toggleSettingsModal();
    }
    if (e.key == "t") {
      toggleSwitcherModal();
    }
    if (e.key == "1") {
      setPoint1();
    } else if (e.key == "2") {
      setPoint2();
    }
  };
}
