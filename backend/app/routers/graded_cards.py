from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import require_vendor_or_admin
from app.core.database import get_db
from app.models.graded_card import GradedCard
from app.schemas.graded_card import GradedCardCreate, GradedCardRead, GradedCardUpdate

router = APIRouter(prefix="/api/graded-cards", tags=["graded-cards"])


@router.get("", response_model=list[GradedCardRead])
async def list_graded_cards(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GradedCard).order_by(GradedCard.created_at.desc()))
    return result.scalars().all()


@router.get("/{card_id}", response_model=GradedCardRead)
async def get_graded_card(card_id: int, db: AsyncSession = Depends(get_db)):
    card = await db.get(GradedCard, card_id)
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carte introuvable")
    return card


@router.post("", response_model=GradedCardRead, status_code=status.HTTP_201_CREATED)
async def create_graded_card(
    payload: GradedCardCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_vendor_or_admin),
):
    card = GradedCard(**payload.model_dump())
    db.add(card)
    await db.commit()
    await db.refresh(card)
    return card


@router.put("/{card_id}", response_model=GradedCardRead)
async def update_graded_card(
    card_id: int,
    payload: GradedCardUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_vendor_or_admin),
):
    card = await db.get(GradedCard, card_id)
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carte introuvable")
    for field, value in payload.model_dump().items():
        setattr(card, field, value)
    await db.commit()
    await db.refresh(card)
    return card


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_graded_card(
    card_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_vendor_or_admin),
):
    card = await db.get(GradedCard, card_id)
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carte introuvable")
    await db.delete(card)
    await db.commit()
