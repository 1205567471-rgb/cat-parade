import http.server, ssl, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()
httpd = http.server.ThreadingHTTPServer(("0.0.0.0", 8443), H)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("cert.pem", "key.pem")
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
print("serving HTTPS on 8443")
httpd.serve_forever()
