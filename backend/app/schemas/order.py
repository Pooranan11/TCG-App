from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.order import OrderStatus


class CartItemInput(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    items: list[CartItemInput]


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    quantity: int
    unit_price: float


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: OrderStatus
    total: float
    created_at: datetime
    items: list[OrderItemRead] = []
