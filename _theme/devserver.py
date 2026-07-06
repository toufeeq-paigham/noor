#!/usr/bin/env python3
"""Static server for the Noor POC with caching disabled.

python's stock http.server sends no Cache-Control header, so browsers
heuristically cache pages/scripts and serve stale designs after edits.
This wrapper forces no-store on every response.
"""
import http.server
import socketserver
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()


PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8474
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), NoCacheHandler) as httpd:
    print(f'Noor POC server (no-store) on http://localhost:{PORT}')
    httpd.serve_forever()
