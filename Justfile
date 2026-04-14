set dotenv-load

# Launch dev environment (rebuild si changements)
dev:
    docker compose up --build

# Launch prod environment
prod:
    docker compose -f docker-compose.prod.yml up -d

# Build all images
build:
    docker compose build

# Stream live logs
logs:
    docker compose logs -f

# Run alembic migrations
migrate:
    docker compose exec backend alembic upgrade head

# Create a new migration
makemigration name="":
    docker compose exec backend alembic revision --autogenerate -m "{{name}}"

# Open bash shell in backend container
shell-backend:
    docker compose exec backend bash

# Open psql shell in postgres container
shell-db:
    docker compose exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

# Stop all containers
down:
    docker compose down

# Stop and remove all volumes (destructive)
reset:
    docker compose down -v

# Run the seed script
seed:
    docker compose exec backend python -m app.seed
