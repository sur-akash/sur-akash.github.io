"""Tiny local dev server for the portfolio site: python3 serve.py -> http://localhost:4174"""
import functools
import http.server
import pathlib
import socketserver

SITE = str(pathlib.Path(__file__).parent.resolve())
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=SITE)


class Server(socketserver.TCPServer):
    allow_reuse_address = True


with Server(("127.0.0.1", 4174), Handler) as httpd:
    print(f"Serving {SITE} at http://127.0.0.1:4174")
    httpd.serve_forever()
