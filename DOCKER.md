Docker image for FSLogix Redirections.xml Generator

This repository includes a small Dockerfile that serves the static web app using nginx:alpine.

Build the image:

```bash
docker build -t fslogix-redirections-builder:latest .
```

Run locally (maps container port 80 to host 8080):

```bash
docker run -d --name fslogix-redirections-builder -p 8080:80 fslogix-redirections-builder:latest
```

Verify: open http://localhost:8080

Notes:
- The Dockerfile copies only `index.html`, `style.css`, `script.js` and `community.js` to keep the image small.
- A minimal `nginx.conf` is provided in `docker/nginx.conf`.
- `.dockerignore` ensures build context is tiny.

Security & Operations:
- Use your orchestration (systemd, docker-compose, k8s) to manage the container in on-prem environments.
- Bind to a non-root port on the host if needed or put behind a reverse proxy.
