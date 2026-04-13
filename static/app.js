const statusNode = document.getElementById("status");

function setStatus(message) {
  if (statusNode) {
    statusNode.textContent = message;
  }
}

window.addEventListener("error", (event) => {
  setStatus(`스크립트 오류: ${event.message}`);
});

window.addEventListener("load", () => {
  setStatus("로드 이벤트 감지");

  if (window.VWORLD_BOOTSTRAP?.skipped) {
    setStatus("API key를 찾지 못했습니다.");
    return;
  }

  if (!window.vw?.ol3?.Map) {
    setStatus("브이월드 2D 스크립트 로드 실패");
    return;
  }

  try {
    vw.ol3.MapOptions = {
      basemapType: vw.ol3.BasemapType.GRAPHIC,
      controlDensity: vw.ol3.DensityType.EMPTY,
      interactionDensity: vw.ol3.DensityType.BASIC,
      controlsAutoArrange: true,
      homePosition: vw.ol3.CameraPosition,
      initPosition: vw.ol3.CameraPosition,
    };

    new vw.ol3.Map("vmap", vw.ol3.MapOptions);
    setStatus("2D 기본지도 로드 성공");
  } catch (error) {
    setStatus(`오류: ${error.message}`);
    console.error(error);
  }
});
