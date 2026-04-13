const statusNode = document.getElementById("status");
let SOPPlugin = null;

function setStatus(message) {
  if (statusNode) {
    statusNode.textContent = message;
  }
}

function withCamera(callback) {
  if (!SOPPlugin) {
    setStatus("SOPPlugin 이 아직 준비되지 않았습니다.");
    return;
  }

  callback(SOPPlugin.getViewCamera());
}

function initCall(obj) {
  SOPPlugin = obj;
  const camera = SOPPlugin.getViewCamera();
  camera.moveLonLat(127.0285, 37.4980);
  camera.setAltitude(10000);
  setStatus("3D 지도 로드 성공");
}

function failureCall(msg) {
  setStatus(`3D 지도 로드 실패: ${msg}`);
}

function movePangyo() {
  withCamera((camera) => {
    camera.moveLonLat(127.0285, 37.4980);
    camera.setAltitude(10000);
    setStatus("판교로 이동");
  });
}

function moveSeoul() {
  withCamera((camera) => {
    camera.moveLonLat(126.9770, 37.5778);
    camera.setAltitude(3000);
    setStatus("경복궁으로 이동");
  });
}

function moveDokdo() {
  withCamera((camera) => {
    camera.moveLonLat(131.8682, 37.2402);
    camera.setAltitude(3000);
    setStatus("독도로 이동");
  });
}

function setLowAltitude() {
  withCamera((camera) => {
    camera.setAltitude(1500);
    setStatus("카메라 고도 변경");
  });
}

function setTilt() {
  withCamera((camera) => {
    camera.setTilt(30);
    setStatus("카메라 기울기 변경");
  });
}

window.movePangyo = movePangyo;
window.moveSeoul = moveSeoul;
window.moveDokdo = moveDokdo;
window.setLowAltitude = setLowAltitude;
window.setTilt = setTilt;
window.initCall = initCall;
window.failureCall = failureCall;

window.addEventListener("error", (event) => {
  setStatus(`스크립트 오류: ${event.message}`);
});

window.addEventListener("load", () => {
  if (window.VWORLD_BOOTSTRAP?.skipped) {
    setStatus("API key를 찾지 못했습니다.");
    return;
  }

  if (!window.sop?.earth?.createInstance) {
    setStatus("sop.earth.createInstance 를 찾지 못했습니다.");
    return;
  }

  setStatus("3D 엔진 인스턴스 생성 중");
  window.setTimeout(() => {
    try {
      sop.earth.createInstance("testmaparea", initCall, failureCall);
    } catch (error) {
      setStatus(`인스턴스 생성 오류: ${error.message}`);
      console.error(error);
    }
  }, 1);
});
