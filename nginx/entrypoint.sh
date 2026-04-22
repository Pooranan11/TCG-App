#!/bin/sh
set -e

DOMAIN="${DOMAIN:-demo.pooranan.com}"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"

if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
    echo "[nginx] No TLS certificate found — generating self-signed placeholder for $DOMAIN"
    mkdir -p "$CERT_DIR"
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" \
        -subj "/CN=$DOMAIN" 2>/dev/null
fi

exec nginx -g "daemon off;"
