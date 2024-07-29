import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { check_mark, loader } from "./html_components";
import { plotSnapshot } from "./image_tools";
import { loadingStatus } from "./types";
import { STSClient, AssumeRoleWithWebIdentityCommand } from "@aws-sdk/client-sts";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { TimestreamQueryClient } from "@aws-sdk/client-timestream-query";

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

export function getTestID(default_redirect: string): string {
  let param = location.pathname;
  if (param == undefined || param == "/" || param.length <= 2) {
    param = "/" + default_redirect + "/";
    window.location.href = location.origin + param;
  }
  return param.slice(1, -1);
}

export function getSharelinkList(): void {
  let param = getQueryVariable("b64");
  if (param == undefined || param == "") {
    globalThis.activeDatasets.to_add = [];
  } else {
    const decodedList = decode(param);
    globalThis.activeDatasets.to_add = decodedList.split(",");
  }
}

export function getSharelink(): [string, string] {
  const bufferString = globalThis.activeDatasets.to_add.join(",");
  let b64: string;
  if (bufferString == undefined || bufferString == "") {
    return [location.origin + location.pathname, ""];
  } else {
    b64 = encode(globalThis.activeDatasets.to_add.join(","));
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
  tabTitle.innerHTML = test_article + "::" + name;
}

export function updateStatus(status: loadingStatus) {
  if (status == loadingStatus.LOADING) {
    document.getElementById("status")!.innerHTML = loader;
  }
  if (status == loadingStatus.DONE) {
    document.getElementById("status")!.innerHTML = check_mark;
  }
}

export function getAWSTokens() {
  // var hash = new URLSearchParams(window.location.search).get("code");
  var hash = window.location.hash.slice(1);
  if (hash.length > 0) {
    var result = hash.split("&").reduce(function (res: any, item) {
      var parts = item.split("=");
      res[parts[0]] = parts[1];
      return res;
    }, {});
    globalThis.aws_auth = result;
    sessionStorage.setItem("aws_auth", JSON.stringify(result));
  }

  var currentStored = sessionStorage.getItem("aws_auth");
  if (currentStored == null && (globalThis.aws_auth == null || globalThis.aws_auth == undefined)) {
    console.log(encodeURIComponent(window.location.href));
    window.location.href =
      "https://psp-auth.auth.us-east-2.amazoncognito.com/oauth2/authorize?client_id=44uqovuaatbg3kq2b49dtldm6i&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A5000";
  }
  if (currentStored != null) {
    globalThis.aws_auth = JSON.parse(sessionStorage.getItem("aws_auth")!);
  }

  globalThis.timestreamQuery = new TimestreamQueryClient({
    region: "us-east-2",
    credentials: fromCognitoIdentityPool({
      identityPoolId: "us-east-2:756dd2ed-4664-4b57-99d1-63033042b449",
      logins: {
        // Change the key below according to the specific region your user pool is in.
        "cognito-idp.us-east-2.amazonaws.com/us-east-2_R0E6V0iNN": globalThis.aws_auth["id_token"],
      },
      clientConfig: { region: "us-east-2" },
    }),
  });
}
