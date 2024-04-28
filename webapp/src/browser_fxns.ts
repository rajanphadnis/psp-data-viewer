function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  // alert("Query Variable " + variable + " not found");
}

export function getTestName(): string {
  let param = location.pathname;
  if (param == undefined || param == "/" || param.length <= 2) {
    param = "/short-duration-hotfire-1/";
  }
  return param.slice(1, -1);
}

export function initAdded(): void {
  let param = getQueryVariable("b64");
  if (param == undefined || param == "") {
    activeDatasets.to_add = [];
  } else {
    const decodedList = decode(param);
    activeDatasets.to_add = decodedList.split(",");
  }
}

export function getSharelink(): string {
  const bufferString = activeDatasets.to_add.join(",");
  let b64: string;
  if (bufferString == undefined || bufferString == "") {
    return location.origin + location.pathname;
  } else {
    b64 = encode(activeDatasets.to_add.join(","));
  }
  const sharelink_base = location.origin + location.pathname + "?b64=" + b64;
  return sharelink_base;
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
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
export function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(async function() {
    console.log('Async: Copying to clipboard was successful!');
    const modButton = document.getElementById("addBtn")!;
    modButton.innerHTML = "Copied!";
    await delay(1500);
    modButton.innerHTML = "Share";
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));