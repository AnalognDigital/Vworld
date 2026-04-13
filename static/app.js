const keyStatus = document.getElementById("key-status");
const mapStatus = document.getElementById("map-status");
const viewerId = "viewer-root";

function setMapStatus(message) {
  if (mapStatus) {
    mapStatus.textContent = message;
  }
}

function getApiKey() {
  return window.VWORLD_CONFIG?.apiKey?.trim() || "";
}

function maskKey(value) {
  if (!value) {
    return "API key 없음";
  }

  return `API key ${value.slice(0, 4)}...${value.slice(-4)}`;
}

function createCameraPosition() {
  return new vw.CameraPosition(
    new vw.CoordZ(127.0369, 37.5006, 18000),
    new vw.Direction(0, -90, 0),
  );
}

function startBasicMap() {
  const map = new vw.Map();
  map.setOption({
    mapId: viewerId,
    initPosition: createCameraPosition(),
    logo: true,
    navigation: true,
  });
  map.start();
  return map;
}

window.addEventListener("load", () => {
  const apiKey = getApiKey();

  if (keyStatus) {
    keyStatus.textContent = maskKey(apiKey);
  }

  if (!apiKey) {
    setMapStatus("API key를 찾지 못했습니다.");
    return;
  }

  if (window.VWORLD_BOOTSTRAP?.skipped || !window.vw?.Map) {
    setMapStatus("브이월드 스크립트 로드 실패");
    return;
  }

  try {
    startBasicMap();

    window.setTimeout(() => {
      const hasCanvas = !!document.querySelector("#viewer-root canvas");
      setMapStatus(hasCanvas ? "3D 지도 로드 성공" : "지도 객체 생성됨, 화면 확인 필요");
    }, 1000);
  } catch (error) {
    setMapStatus(`오류: ${error.message}`);
    console.error(error);
  }
});
