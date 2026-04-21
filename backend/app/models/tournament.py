import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TournamentStatus(str, enum.Enum):
    UPCOMING = "UPCOMING"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    game: Mapped[str] = mapped_column(String(100), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    max_players: Mapped[int] = mapped_column(Integer, nullable=False)
    registered_players: Mapped[int] = mapped_column(Integer, default=0)
    entry_fee: Mapped[float] = mapped_column(Numeric(10, 2), default=0.0)
    status: Mapped[TournamentStatus] = mapped_column(
        Enum(TournamentStatus, name="tournamentstatus"), default=TournamentStatus.UPCOMING
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
