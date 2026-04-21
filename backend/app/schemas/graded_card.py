from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.graded_card import GradingCompany


class GradedCardBase(BaseModel):
    card_name: str
    card_number: str
    set_name: str
    pokemon_tcg_id: str | None = None
    image_url: str | None = None
    grading_company: GradingCompany
    grade: str
    cert_number: str | None = None
    price: float = Field(gt=0)
    stock: int = Field(default=1, ge=0)
    description: str | None = None


class GradedCardCreate(GradedCardBase):
    pass


class GradedCardUpdate(GradedCardBase):
    pass


class GradedCardRead(GradedCardBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
