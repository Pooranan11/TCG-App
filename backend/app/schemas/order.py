from datetime import datetime

from pydantic import BaseModel, ConfigDict, model_validator

from app.models.order import OrderStatus


class CartItemInput(BaseModel):
    product_id: int | None = None
    graded_card_id: int | None = None
    quantity: int

    @model_validator(mode="after")
    def check_item_type(self) -> "CartItemInput":
        if self.product_id is None and self.graded_card_id is None:
            raise ValueError("product_id ou graded_card_id est requis")
        if self.product_id is not None and self.graded_card_id is not None:
            raise ValueError("product_id et graded_card_id ne peuvent pas être définis simultanément")
        return self


class OrderCreate(BaseModel):
    items: list[CartItemInput]


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    graded_card_id: int | None
    quantity: int
    unit_price: float


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: OrderStatus
    total: float
    created_at: datetime
    items: list[OrderItemRead] = []
