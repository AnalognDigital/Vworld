const currentUrl = document.getElementById("current-url");
const apiKeyStatus = document.getElementById("api-key-status");
const mapStatus = document.getElementById("map-status");
const viewerCanvasId = "viewer-canvas";

let mapInstance = null;
let loaderPromise = null;

if (currentUrl) {
  currentUrl.textContent = window.location.href;
}

function setStatus(message, tone = "info") {
  if (!mapStatus) {
    return;
  }

  mapStatus.textContent = message;
  mapStatus.dataset.tone = tone;
}

function setKeyStatus(message) {
  if (apiKeyStatus) {
    apiKeyStatus.textContent = message;
  }
}

function maskKey(value) {
  if (!value) {
    return "없음";
  }

  if (value.length <= 8) {
    return "저장됨";
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function getStoredKey() {
  const runtimeKey = window.VWORLD_CONFIG?.apiKey?.trim();
  if (runtimeKey) {
    return runtimeKey;
  }

  return "";
}

function updateKeyUi() {
  const key = getStoredKey();
  setKeyStatus(maskKey(key));
}

function buildLoaderUrl(apiKey) {
  const params = new URLSearchParams({
    version: "3.0",
    apiKey,
    domain: window.location.origin,
  });

  return `https://map.vworld.kr/js/webglMapInit.js.do?${params.toString()}`;
}

function loadVworldScript(apiKey) {
  if (loaderPromise) {
    return loaderPromise;
  }

  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = buildLoaderUrl(apiKey);
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("브이월드 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return loaderPromise;
}

function createDefaultCameraPosition() {
  return new vw.CameraPosition(
    new vw.CoordZ(127.0369, 37.5006, 18000),
    new vw.Direction(0, -90, 0),
  );
}

function startMap() {
  if (!window.vw?.Map) {
    throw new Error("브이월드 3D API 객체를 찾지 못했습니다.");
  }

  if (mapInstance) {
    return mapInstance;
  }

  const map = new vw.Map();
  map.setOption({
    mapId: viewerCanvasId,
    initPosition: createDefaultCameraPosition(),
    logo: true,
    navigation: true,
  });
  map.setMapId(viewerCanvasId);
  map.setInitPosition(createDefaultCameraPosition());
  map.setLogoVisible(true);
  map.setNavigationZoomVisible(true);
  map.start();

  mapInstance = map;
  return map;
}

async function initMap() {
  const apiKey = getStoredKey();
  updateKeyUi();

  if (!apiKey) {
    setStatus("API 키를 찾지 못했습니다. 로컬은 api.env, GitHub Pages는 저장소 Secret으로 설정해야 합니다.", "warning");
    return;
  }

  setStatus("브이월드 3D 스크립트를 불러오는 중입니다.", "info");

  try {
    await loadVworldScript(apiKey);
    startMap();
    setStatus("브이월드 3D 지도가 로드되었습니다.", "success");
  } catch (error) {
    loaderPromise = null;
    setStatus(error.message, "error");
    console.error(error);
  }
}

async function loadOptionalConfig() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "./static/config.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
}

window.VWORLD_APP = {
  viewerRootId: "viewer-root",
  serviceUrl: window.location.href,
  origin: window.location.origin,
  path: window.location.pathname,
  initMap,
};

loadOptionalConfig().finally(() => {
  updateKeyUi();
  initMap();
});
