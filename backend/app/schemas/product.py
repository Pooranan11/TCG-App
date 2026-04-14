from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.product import ProductCategory


class ProductBase(BaseModel):
    name: str
    description: str | None = None
    price: float
    category: ProductCategory
    stock: int = 0
    image_url: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
