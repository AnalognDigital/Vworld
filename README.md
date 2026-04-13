# VWorld Service URL Base Page

VWorld 서비스 URL로 등록하기 위한 최소 웹페이지입니다.
현재 등록 대상 엔트리는 루트 경로 `/` 입니다.

## 구성

- `index.html`: VWorld 서비스 URL 등록용 기본 엔트리 페이지
- `static/style.css`: 화면 스타일
- `static/app.js`: 현재 URL 표시 및 추후 연동용 전역 설정
- `server.py`: 로컬 확인용 단순 HTTP 서버

## 실행

PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
python .\server.py
```

브라우저에서 `http://127.0.0.1:8000/` 접속

로컬 실행 시 `api.env`가 있으면 `server.py`가 `/static/config.js`를 자동 생성 응답하여
브이월드 3D 지도를 바로 로드합니다.

`api.env`는 다음 형식 중 아무거나 사용할 수 있습니다.

```text
VWORLD_API_KEY=발급받은키
```

```text
발급받은키
```

## GitHub Pages 배포

GitHub Pages는 `api.env`를 직접 읽지 못하므로 저장소 Secret을 사용합니다.

1. GitHub 저장소 `Settings > Secrets and variables > Actions`
2. `New repository secret`
3. 이름: `VWORLD_API_KEY`
4. 값: 브이월드 API 키
5. `Actions` 탭에서 `Deploy GitHub Pages with VWorld key` 실행
6. `Settings > Pages` 에서 Source를 `GitHub Actions`로 변경

배포 시 워크플로가 `static/config.js`를 생성해 페이지가 자동으로 API 키를 읽습니다.

## 주의

VWorld에 등록하는 서비스 URL은 실제 배포 주소와 정확히 일치해야 합니다.

- `http` / `https`
- 도메인
- 포트
- 경로

이 값이 다르면 이후 API 호출 시 오류가 날 수 있습니다.

예:

- 로컬 확인용: `http://127.0.0.1:8000/`
- 실제 등록용 예시: `https://your-domain.com/`
