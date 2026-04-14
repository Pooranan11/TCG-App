from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.redis import redis_client
from app.models.tournament import Tournament
from app.schemas.tournament import TournamentCreate, TournamentRead, TournamentUpdate

router = APIRouter(prefix="/api/tournaments", tags=["tournaments"])


@router.get("", response_model=list[TournamentRead])
async def list_tournaments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tournament).order_by(Tournament.date.asc()))
    return result.scalars().all()


@router.get("/{tournament_id}", response_model=TournamentRead)
async def get_tournament(tournament_id: int, db: AsyncSession = Depends(get_db)):
    tournament = await db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    return tournament


@router.post("", response_model=TournamentRead, status_code=status.HTTP_201_CREATED)
async def create_tournament(payload: TournamentCreate, db: AsyncSession = Depends(get_db)):
    tournament = Tournament(**payload.model_dump())
    db.add(tournament)
    await db.commit()
    await db.refresh(tournament)
    return tournament


@router.put("/{tournament_id}", response_model=TournamentRead)
async def update_tournament(
    tournament_id: int, payload: TournamentUpdate, db: AsyncSession = Depends(get_db)
):
    tournament = await db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    for field, value in payload.model_dump().items():
        setattr(tournament, field, value)
    await db.commit()
    await db.refresh(tournament)
    return tournament


@router.delete("/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tournament(tournament_id: int, db: AsyncSession = Depends(get_db)):
    tournament = await db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    await db.delete(tournament)
    await db.commit()


@router.post("/{tournament_id}/register", response_model=TournamentRead)
async def register_for_tournament(
    tournament_id: int,
    player_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Register a player for a tournament. Uses Redis to prevent double-registration."""
    tournament = await db.get(Tournament, tournament_id)
    if not tournament:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")

    if tournament.registered_players >= tournament.max_players:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tournament is full",
        )

    redis_key = f"tournament:{tournament_id}:player:{player_id}"
    already_registered = await redis_client.get(redis_key)
    if already_registered:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Player already registered for this tournament",
        )

    await redis_client.set(redis_key, "1")
    tournament.registered_players += 1
    await db.commit()
    await db.refresh(tournament)
    return tournament
