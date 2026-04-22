#!/bin/sh
set -e

DOMAIN="${DOMAIN:-demo.pooranan.com}"
LE_LIVE="/etc/letsencrypt/live"
SELF_SIGNED_DIR="/etc/nginx/ssl"

# Cherche le cert Let's Encrypt (gère le suffixe -0001 de certbot --force-renewal)
CERT_DIR=""
if [ -f "$LE_LIVE/$DOMAIN/fullchain.pem" ]; then
    CERT_DIR="$LE_LIVE/$DOMAIN"
elif [ -f "$LE_LIVE/${DOMAIN}-0001/fullchain.pem" ]; then
    CERT_DIR="$LE_LIVE/${DOMAIN}-0001"
fi

if [ -z "$CERT_DIR" ]; then
    echo "[nginx] Aucun certificat TLS trouvé — génération d'un cert auto-signé pour $DOMAIN"
    mkdir -p "$SELF_SIGNED_DIR"
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$SELF_SIGNED_DIR/privkey.pem" \
        -out "$SELF_SIGNED_DIR/fullchain.pem" \
        -subj "/CN=$DOMAIN" 2>/dev/null
    CERT_DIR="$SELF_SIGNED_DIR"
fi

# Met à jour le chemin du cert dans la config nginx
sed -i "s|$LE_LIVE/$DOMAIN/|$CERT_DIR/|g" /etc/nginx/nginx.conf

exec nginx -g "daemon off;"
