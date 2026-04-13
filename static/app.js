const currentUrl = document.getElementById("current-url");

if (currentUrl) {
  currentUrl.textContent = window.location.href;
}

window.VWORLD_APP = {
  viewerRootId: "viewer-root",
  serviceUrl: window.location.href,
  origin: window.location.origin,
  path: window.location.pathname,
};

console.log("VWorld base page loaded", window.VWORLD_APP);
