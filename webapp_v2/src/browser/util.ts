import moment from "moment";

export function fallbackCopyTextToClipboard(text: string) {
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
