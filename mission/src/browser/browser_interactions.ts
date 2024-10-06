export function browser_checks() {
  // @ts-expect-error
  var isChromium = !!navigator.userAgentData && navigator.userAgentData.brands.some((data) => data.brand == "Chromium");
  if (!isChromium) {
    const message =
      "This site may not work properly on your browser. Please use a Chromium-based browser for the best experience\n\nRecommended Browsers: Google Chrome or Microsoft Edge";
    console.warn(message);
    alert(message);
  }

  if (!("Proxy" in window)) {
    console.warn("Your browser doesn't support Proxies. Some features may not work properly.");
  }
}
