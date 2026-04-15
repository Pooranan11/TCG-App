import asyncio
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from app.core.config import settings
from app.core.database import engine
from app.core.redis import redis_client
from app.routers import products, tournaments, auth

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="Chasseur de Jeux API", version="1.0.0")


@app.on_event("startup")
async def wait_for_db() -> None:
    for attempt in range(1, 21):
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            logger.info("Database connection established.")
            return
        except OperationalError:
            logger.warning("Database not ready yet (attempt %d/20), retrying in 2s…", attempt)
            await asyncio.sleep(2)
    logger.error("Could not connect to the database after 20 attempts.")


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(tournaments.router)


@app.get("/health")
async def health():
    db_status = "ok"
    redis_status = "ok"

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_status = "error"

    try:
        await redis_client.ping()
    except Exception:
        redis_status = "error"

    overall = "ok" if db_status == "ok" and redis_status == "ok" else "error"
    return {"status": overall, "db": db_status, "redis": redis_status}
