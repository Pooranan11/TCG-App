# Déploiement sur Hetzner VPS

## 1. Préparer le serveur

```bash
# Connexion SSH
ssh root@<IP_VPS>

# Mise à jour du système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# Installer Docker Compose plugin
apt install -y docker-compose-plugin

# Installer Just
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /usr/local/bin
```

## 2. Cloner le dépôt

```bash
cd /opt
git clone https://github.com/<votre-user>/TCG-App.git
cd TCG-App
```

## 3. Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env
```

Remplir les valeurs :

```env
POSTGRES_DB=tcg
POSTGRES_USER=tcg
POSTGRES_PASSWORD=<mot-de-passe-fort>
POSTGRES_HOST=db
REDIS_URL=redis://redis:6379
SECRET_KEY=<clé-secrète-aléatoire>
CORS_ORIGINS=https://<votre-domaine>
APP_ENV=production
VITE_API_URL=https://<votre-domaine>/api
UMAMI_DB_PASSWORD=<mot-de-passe-umami>
UMAMI_APP_SECRET=<secret-umami>
```

## 4. Configurer le domaine dans Nginx

Éditer `nginx/nginx.prod.conf` et remplacer `${DOMAIN}` par votre domaine, ou exporter la variable :

```bash
export DOMAIN=monsite.com
```

## 5. Obtenir un certificat SSL avec Certbot

```bash
apt install -y certbot

# Certbot standalone (arrêter nginx avant si besoin)
certbot certonly --standalone -d <votre-domaine> --email <votre-email> --agree-tos
```

Les certificats sont générés dans `/etc/letsencrypt/live/<votre-domaine>/`.

## 6. Lancer en production

```bash
just prod
```

Vérifie que tout tourne :

```bash
docker compose -f docker-compose.prod.yml ps
```

## 7. Exécuter les migrations et le seed

```bash
just migrate
just seed
```

## 8. Renouvellement SSL automatique

```bash
crontab -e
# Ajouter :
0 3 * * * certbot renew --quiet && docker compose -f /opt/TCG-App/docker-compose.prod.yml exec nginx nginx -s reload
```

---

## Commandes `just` utiles

| Commande | Description |
|---|---|
| `just dev` | Lance l'environnement de développement |
| `just prod` | Lance en production (détaché) |
| `just build` | Build toutes les images Docker |
| `just logs` | Affiche les logs en temps réel |
| `just migrate` | Applique les migrations Alembic |
| `just makemigration name="desc"` | Génère une migration |
| `just shell-backend` | Shell bash dans le backend |
| `just shell-db` | psql dans PostgreSQL |
| `just down` | Arrête les conteneurs |
| `just reset` | Arrête et supprime les volumes (attention !) |
| `just seed` | Insère les données de démo |

## Vérification finale

```bash
curl https://<votre-domaine>/health
curl https://<votre-domaine>/api/products
curl https://<votre-domaine>/api/tournaments
```

Chaque commande doit retourner HTTP 200.
