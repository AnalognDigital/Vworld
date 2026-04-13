const statusNode = document.getElementById("status");
let map = null;

function setStatus(message) {
  if (statusNode) {
    statusNode.textContent = message;
  }
}

function vwmap() {
  const options = {
    mapId: "vmap",
    initPosition: new vw.CameraPosition(
      new vw.CoordZ(127.425, 38.196, 1548700),
      new vw.Direction(0, -90, 0),
    ),
    logo: true,
    navigation: true,
  };

  map = new vw.Map();
  map.setOption(options);
  map.start();
}

function vwmoveTo(x, y, z) {
  if (!map) {
    setStatus("지도 객체가 아직 없습니다.");
    return;
  }

  const movePo = new vw.CoordZ(x, y, z);
  const mPosi = new vw.CameraPosition(movePo, new vw.Direction(0, -80, 0));
  map.moveTo(mPosi);
  setStatus(`이동: ${x}, ${y}, ${z}`);
}

window.vwmoveTo = vwmoveTo;

window.addEventListener("error", (event) => {
  setStatus(`스크립트 오류: ${event.message}`);
});

window.addEventListener("load", () => {
  if (window.VWORLD_BOOTSTRAP?.skipped) {
    setStatus("API key를 찾지 못했습니다.");
    return;
  }

  if (!window.vw?.Map) {
    setStatus("vw.Map 을 찾지 못했습니다.");
    return;
  }

  try {
    vwmap();
    window.setTimeout(() => {
      const hasCanvas = !!document.querySelector("#vmap canvas");
      setStatus(hasCanvas ? "3D 지도 로드 성공" : "지도 객체 생성됨, 화면 확인 필요");
    }, 1000);
  } catch (error) {
    setStatus(`오류: ${error.message}`);
    console.error(error);
  }
});
