from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderRead

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Le panier est vide")

    total = 0.0
    prepared_items: list[dict] = []

    for item in payload.items:
        if item.quantity < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Quantité invalide pour le produit {item.product_id}",
            )
        product = await db.get(Product, item.product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produit {item.product_id} introuvable",
            )
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Stock insuffisant pour « {product.name} » (disponible : {product.stock})",
            )
        total += product.price * item.quantity
        prepared_items.append(
            {"product": product, "quantity": item.quantity, "unit_price": product.price}
        )

    order = Order(user_id=current_user.id, total=round(total, 2))
    db.add(order)
    await db.flush()

    for pi in prepared_items:
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=pi["product"].id,
                quantity=pi["quantity"],
                unit_price=pi["unit_price"],
            )
        )
        pi["product"].stock -= pi["quantity"]

    await db.commit()

    result = await db.execute(
        select(Order).where(Order.id == order.id).options(selectinload(Order.items))
    )
    return result.scalar_one()


@router.get("/me", response_model=list[OrderRead])
async def my_orders(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()
