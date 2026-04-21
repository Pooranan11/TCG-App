import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class GradingCompany(str, enum.Enum):
    PSA = "PSA"
    BGS = "BGS"
    CGC = "CGC"


class GradedCard(Base):
    __tablename__ = "graded_cards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    card_name: Mapped[str] = mapped_column(String(255), nullable=False)
    card_number: Mapped[str] = mapped_column(String(20), nullable=False)
    set_name: Mapped[str] = mapped_column(String(255), nullable=False)
    pokemon_tcg_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    grading_company: Mapped[GradingCompany] = mapped_column(
        Enum(GradingCompany, name="gradingcompany"), nullable=False
    )
    grade: Mapped[str] = mapped_column(String(10), nullable=False)
    cert_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=1)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
