ARG FRONTEND_IMAGE=ghcr.io/pooranan11/tcg-frontend:latest
FROM ${FRONTEND_IMAGE} AS frontend

FROM nginx:1.25-alpine
ARG CONFIG=nginx.conf
COPY ${CONFIG} /etc/nginx/nginx.conf
COPY --from=frontend /app/dist /usr/share/nginx/html
