#!/usr/bin/env python3
"""Serve the built dist/ locally (no-store), mirroring Firebase directory-index
behaviour: /qibla → /qibla/ → dist/qibla/index.html. For verifying `npm run build`."""
import http.server
import os
import socketserver
import sys

DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=DIST, **k)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()


PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8475
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f'dist/ server on http://localhost:{PORT}')
    httpd.serve_forever()
