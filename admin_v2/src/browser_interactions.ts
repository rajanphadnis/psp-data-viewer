import moment from "moment";

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
      // const modButton = document.getElementById(copy_button)!;
      // modButton.innerHTML = "Copied!";
      // await delay(1500);
      // modButton.innerHTML = original_text;
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    },
  );
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function genId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function getDateLabel(timestamp: number): string {
  const offset = new Date().getTimezoneOffset();
  const targetTime = moment.utc(timestamp).toDate();
  const offsetTime = new Date(targetTime.getTime() + offset * 60 * 1000);
  const toReturn = `${(offsetTime.getMonth() + 1).toString().padStart(2, "0")}/${offsetTime
    .getDate()
    .toString()
    .padStart(2, "0")}/${offsetTime.getFullYear().toString().slice(2)}`;
  console.log(toReturn);
  return toReturn;
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export const decode = (str: string): string => atob(str);

export const encode = (str: string): string => btoa(str);
