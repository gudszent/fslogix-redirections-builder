# Minimal Dockerfile to serve the static FSLogix Redirections generator
# Keeps image small by copying only the necessary static files and using nginx:alpine

FROM nginx:stable-alpine
LABEL maintainer="GitHub Copilot"

# Create webroot and copy only the static assets needed for the app
COPY index.html style.css script.js community.js /usr/share/nginx/html/

# Replace default nginx config with a tiny, secure one
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Simple healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ || exit 1

# Start nginx (default command in base image is fine)
