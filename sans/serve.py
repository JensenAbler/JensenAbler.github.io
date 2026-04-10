#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import threading

PORT = 8888
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def log_message(self, format, *args):
        pass  # suppress request logs

def open_browser():
    import time
    time.sleep(0.5)
    webbrowser.open(f"http://localhost:{PORT}")

print(f"Starting SANS viewer at http://localhost:{PORT}")
print("Press Ctrl+C to stop.")

threading.Thread(target=open_browser, daemon=True).start()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
