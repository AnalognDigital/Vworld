import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
ENV_FILE = ROOT / "api.env"


def load_api_key() -> str:
    if not ENV_FILE.exists():
        return ""

    for raw_line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" in line:
            return line.split("=", 1)[1].strip().strip("\"'")
        if ":" in line:
            return line.split(":", 1)[1].strip().strip("\"'")
        return line.strip().strip("\"'")

    return ""


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/static/config.js":
            self.serve_runtime_config()
            return

        super().do_GET()

    def serve_runtime_config(self) -> None:
        payload = {"apiKey": load_api_key()}
        body = f"window.VWORLD_CONFIG = {json.dumps(payload, ensure_ascii=True)};".encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/javascript; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def run() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8000), Handler)
    print("Serving at http://127.0.0.1:8000")
    server.serve_forever()


if __name__ == "__main__":
    run()
