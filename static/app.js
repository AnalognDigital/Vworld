const currentUrl = document.getElementById("current-url");
const apiKeyStatus = document.getElementById("api-key-status");
const mapStatus = document.getElementById("map-status");
const searchStatus = document.getElementById("search-status");
const searchResult = document.getElementById("search-result");
const viewerCanvasId = "viewer-root";

let mapInstance = null;

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

function setSearchStatus(message) {
  if (searchStatus) {
    searchStatus.textContent = message;
  }
}

function setSearchResult(message, tone = "info") {
  if (!searchResult) {
    return;
  }

  searchResult.textContent = message;
  searchResult.dataset.tone = tone;
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

function buildSearchUrl(apiKey) {
  const params = new URLSearchParams({
    service: "search",
    request: "search",
    version: "2.0",
    size: "1",
    page: "1",
    query: "판교역",
    type: "place",
    format: "json",
    errorformat: "json",
    key: apiKey,
  });

  return `https://api.vworld.kr/req/search?${params.toString()}`;
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
  map.start();

  mapInstance = map;
  return map;
}

async function initMap() {
  const apiKey = getStoredKey();
  updateKeyUi();

  if (!apiKey) {
    setStatus("API 키를 찾지 못했습니다. 로컬은 api.env, GitHub Pages는 저장소 Secret으로 설정해야 합니다.", "warning");
    setSearchStatus("키 없음");
    setSearchResult("검색 API 테스트도 키가 없어 실행하지 않았습니다.", "warning");
    return;
  }

  setStatus("브이월드 3D 스크립트 상태를 확인하는 중입니다.", "info");

  try {
    if (window.VWORLD_BOOTSTRAP?.skipped) {
      throw new Error("브이월드 3D 스크립트 초기화가 건너뛰어졌습니다.");
    }
    startMap();
    window.setTimeout(() => {
      const viewerRoot = document.getElementById(viewerCanvasId);
      const hasCanvas = !!viewerRoot?.querySelector("canvas");
      setStatus(
        hasCanvas ? "브이월드 3D 지도가 로드되었습니다." : "브이월드 객체는 생성됐지만 화면 캔버스가 아직 보이지 않습니다.",
        hasCanvas ? "success" : "warning",
      );
    }, 800);
  } catch (error) {
    setStatus(error.message, "error");
    console.error(error);
  }
}

async function testSearchApi() {
  const apiKey = getStoredKey();

  if (!apiKey) {
    setSearchStatus("키 없음");
    setSearchResult("검색 API 테스트도 키가 없어 실행하지 않았습니다.", "warning");
    return;
  }

  setSearchStatus("호출 중");
  setSearchResult("브이월드 검색 API를 호출하는 중입니다.", "info");

  try {
    const response = await fetch(buildSearchUrl(apiKey));
    const payload = await response.json();

    if (!response.ok || payload?.response?.status !== "OK") {
      throw new Error(payload?.response?.error?.text || "브이월드 검색 API 호출이 실패했습니다.");
    }

    const item = payload.response.result.items?.[0];
    const title = item?.title || "결과 없음";
    const category = item?.category || "분류 없음";

    setSearchStatus("성공");
    setSearchResult(`검색 성공: ${title} / ${category}`, "success");
  } catch (error) {
    setSearchStatus("실패");
    setSearchResult(`검색 실패: ${error.message} (브라우저 CORS 제한일 수 있음)`, "error");
    console.error(error);
  }
}

window.VWORLD_APP = {
  viewerRootId: "viewer-root",
  serviceUrl: window.location.href,
  origin: window.location.origin,
  path: window.location.pathname,
  initMap,
};

updateKeyUi();
testSearchApi();
window.addEventListener("load", () => {
  initMap();
});
