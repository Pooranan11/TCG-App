ARG FRONTEND_IMAGE=ghcr.io/pooranan11/tcg-frontend:latest
FROM ${FRONTEND_IMAGE} AS frontend

FROM nginx:1.25-alpine
RUN apk add --no-cache openssl
ARG CONFIG=nginx.conf
COPY ${CONFIG} /etc/nginx/nginx.conf
COPY --from=frontend /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
